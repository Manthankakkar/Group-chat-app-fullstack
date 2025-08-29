// models/group.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // group must have a name
  },
  createdBy: {
    type: DataTypes.INTEGER, // userId of group creator
    allowNull: false,
  },
});

module.exports = Group;
