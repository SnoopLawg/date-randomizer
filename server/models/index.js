import sequelize from "../config/database.js";
import DateEvent from "./DateEvent.js";
import User from "./User.js";

// Initialize all models
const models = {
  DateEvent,
  User,
};

// Define associations
DateEvent.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(DateEvent, { foreignKey: "user_id" });

export { models as default, User, DateEvent };
