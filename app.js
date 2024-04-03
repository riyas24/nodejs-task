import express from "express";
import bodyparser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import expressHbs from "express-handlebars";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

routes(app);

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

export const hbs = expressHbs.create({
  extname: "hbs",
  defaultLayout: "main-layout",
  layoutsDir: path.join(__dirname, "views/layout"),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Connected to the database.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
