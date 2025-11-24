const { Beneficiary, User } = require("../models");

exports.addBeneficiary = async (req, res) => {
  const { email, nickname } = req.body;
  try {
    const beneficiaryUser = await User.findOne({ where: { email } });
    if (!beneficiaryUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (beneficiaryUser.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a beneficiary" });
    }

    const existing = await Beneficiary.findOne({
      where: {
        user_id: req.user.id,
        beneficiary_user_id: beneficiaryUser.id,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Beneficiary already exists" });
    }

    const beneficiary = await Beneficiary.create({
      user_id: req.user.id,
      beneficiary_user_id: beneficiaryUser.id,
      nickname: nickname || beneficiaryUser.name,
    });

    // Fetch details to return complete object
    const created = await Beneficiary.findByPk(beneficiary.id, {
      include: [{ model: User, as: "details", attributes: ["name", "email"] }],
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.findAll({
      where: { user_id: req.user.id },
      include: [{ model: User, as: "details", attributes: ["name", "email"] }],
    });
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    await beneficiary.destroy();
    res.json({ message: "Beneficiary removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
