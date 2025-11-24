const { Wallet, Transaction, User, sequelize } = require("../models");

exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ where: { user_id: req.user.id } });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    res.json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMoney = async (req, res) => {
  const { amount } = req.body;
  const t = await sequelize.transaction();

  try {
    const wallet = await Wallet.findOne(
      { where: { user_id: req.user.id } },
      { transaction: t }
    );

    wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
    await wallet.save({ transaction: t });

    await Transaction.create(
      {
        wallet_id: wallet.id,
        type: "CREDIT",
        amount,
        description: "Added to wallet",
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ balance: wallet.balance });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

exports.transferMoney = async (req, res) => {
  const { amount, recipientEmail } = req.body;
  const t = await sequelize.transaction();

  try {
    const senderWallet = await Wallet.findOne(
      { where: { user_id: req.user.id } },
      { transaction: t }
    );

    if (parseFloat(senderWallet.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const recipient = await User.findOne({ where: { email: recipientEmail } });
    if (!recipient) {
      await t.rollback();
      return res.status(404).json({ message: "Recipient not found" });
    }

    const recipientWallet = await Wallet.findOne(
      { where: { user_id: recipient.id } },
      { transaction: t }
    );

    // Debit Sender
    senderWallet.balance =
      parseFloat(senderWallet.balance) - parseFloat(amount);
    await senderWallet.save({ transaction: t });

    await Transaction.create(
      {
        wallet_id: senderWallet.id,
        type: "DEBIT",
        amount,
        description: `Transfer to ${recipient.name}`,
        related_user_id: recipient.id,
      },
      { transaction: t }
    );

    // Credit Recipient
    recipientWallet.balance =
      parseFloat(recipientWallet.balance) + parseFloat(amount);
    await recipientWallet.save({ transaction: t });

    await Transaction.create(
      {
        wallet_id: recipientWallet.id,
        type: "CREDIT",
        amount,
        description: `Received from ${req.user.name}`,
        related_user_id: req.user.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "Transfer successful", balance: senderWallet.balance });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

exports.payBill = async (req, res) => {
  const { amount, serviceType } = req.body;
  const t = await sequelize.transaction();

  try {
    const wallet = await Wallet.findOne(
      { where: { user_id: req.user.id } },
      { transaction: t }
    );

    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
    await wallet.save({ transaction: t });

    await Transaction.create(
      {
        wallet_id: wallet.id,
        type: "DEBIT",
        amount,
        description: `Bill Payment: ${serviceType}`,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "Payment successful", balance: wallet.balance });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

exports.validateRecipient = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    // Don't return sensitive info, just name and email
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
