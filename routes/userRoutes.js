// routes/userRoutes.js
import { Router } from "express";
import multer from "multer";
const router = Router();
import controllers from "../controllers/indexController.js";

const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({ storage: storage });

router.get("/", controllers.userController.getAllUsers);
router.get("/get-user", controllers.userController.getUser);
router.post(
  "/create",
  upload.single("profile"),
  controllers.userController.createUser
);
router.post(
  "/update",
  upload.single("profile"),
  controllers.userController.updateUser
);
router.post("/delete", controllers.userController.deleteUser);
router.post("/login", controllers.userController.login);
router.post("/send-mail", controllers.userController.sendMail);

export default router;
