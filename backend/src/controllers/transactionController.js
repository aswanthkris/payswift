const { Transaction, Wallet } = require('../models');

exports.getTransactions = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ where: { user_id: req.user.id } });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const transactions = await Transaction.findAll({
      where: { wallet_id: wallet.id },
      order: [['createdAt', 'DESC']],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
