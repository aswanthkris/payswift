const { Transaction, Wallet } = require("../models");
const { Op } = require("sequelize");

exports.getAnalytics = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ where: { user_id: req.user.id } });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Income vs Expense (Current Month)
    const transactions = await Transaction.findAll({
      where: {
        wallet_id: wallet.id,
        createdAt: {
          [Op.gte]: firstDayOfMonth,
        },
      },
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "CREDIT") {
        income += parseFloat(tx.amount);
      } else {
        expense += parseFloat(tx.amount);
      }
    });

    // Daily Spending Trend (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyTransactions = await Transaction.findAll({
      where: {
        wallet_id: wallet.id,
        type: "DEBIT",
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      order: [["createdAt", "ASC"]],
    });

    const dailySpending = {};
    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailySpending[dateStr] = 0;
    }

    weeklyTransactions.forEach((tx) => {
      const dateStr = tx.createdAt.toISOString().split("T")[0];
      if (dailySpending[dateStr] !== undefined) {
        dailySpending[dateStr] += parseFloat(tx.amount);
      }
    });

    const trendData = Object.keys(dailySpending)
      .sort()
      .map((date) => ({
        date,
        amount: dailySpending[date],
      }));

    res.json({
      income,
      expense,
      trend: trendData,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: error.message });
  }
};
