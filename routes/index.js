// routes/index.js
import userRoutes from "./userRoutes.js";

export default (app) => {
  app.use("/api/user", userRoutes);
};
