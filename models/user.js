import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "please enter your name",
      },
      notNull: true,
      is: /^[a-z]{0,20}$/i,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: true,
      notEmpty: {
        msg: "please enter your name",
      },
      isEmail: {
        msg: "enter valid email address",
      },
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      // isStrongPassword(value) {
      //   if (
      //     !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
      //       value
      //     )
      //   ) {
      //     throw new Error(
      //       "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      //     );
      //   }
      // },
    },
    set(value) {
      const hash = bcrypt.hashSync(value, 12);
      this.setDataValue("password", hash);
    },
    notEmpty: {
      msg: "please enter your password",
    },
    notNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: {
        msg: "please enter your phone",
      },
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: {
        msg: "please enter your address",
      },
    },
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: {
        msg: "please enter your pincode",
      },
      isNumeric: {
        msg: "pincode must be a number",
      },
    },
  },
  profile: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: {
        msg: "please upload file",
      },
    },
  },
});

export default User;
