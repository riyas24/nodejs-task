import { Sequelize } from "sequelize";

const sequelize = new Sequelize("test", "root", "pass", {
  host: "localhost",
  dialect:"mysql"
});

export default sequelize;