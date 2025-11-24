const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Beneficiary = sequelize.define("Beneficiary", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  beneficiary_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Beneficiary;
