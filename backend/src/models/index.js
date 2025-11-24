const sequelize = require("../config/database");
const User = require("./User");
const Wallet = require("./Wallet");
const Transaction = require("./Transaction");
const Beneficiary = require("./Beneficiary");

// Associations
User.hasOne(Wallet, { foreignKey: "user_id" });
Wallet.belongsTo(User, { foreignKey: "user_id" });

Wallet.hasMany(Transaction, { foreignKey: "wallet_id" });
Transaction.belongsTo(Wallet, { foreignKey: "wallet_id" });

User.hasMany(Beneficiary, { foreignKey: "user_id", as: "beneficiaries" });
Beneficiary.belongsTo(User, { foreignKey: "user_id", as: "owner" });
Beneficiary.belongsTo(User, {
  foreignKey: "beneficiary_user_id",
  as: "details",
});

module.exports = {
  sequelize,
  User,
  Wallet,
  Transaction,
  Beneficiary,
};
