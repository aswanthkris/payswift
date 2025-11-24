const bcrypt = require("../../../node_modules/bcryptjs/umd");
const jwt = require("jsonwebtoken");
const { User, Wallet } = require("../models");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.signup = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password_hash,
    });

    // Create Wallet for user
    await Wallet.create({ user_id: user.id });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        kyc_verified: user.kyc_verified,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateKYC = async (req, res) => {
  const { kycId } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.kyc_verified = true;
      user.kyc_data = { idNumber: kycId };
      await user.save();

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        kyc_verified: user.kyc_verified,
        token: generateToken(user.id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
