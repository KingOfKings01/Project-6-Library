const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Submitted = sequelize.define("Submitted", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: DataTypes.INTEGER,
  date: DataTypes.STRING,
  
});

module.exports = Submitted;
