// controllers/userController.js
// import { Op } from "sequelize";
// import sequelize from "../config/database.js";
import models from "../models/index.js";
import bcrypt from "bcrypt";
import * as env from "dotenv";
env.config();

import emailService from "../helpers/email.js";
import { hbs } from "../app.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  getAllUsers: async (req, res, next) => {
    try {
      let { page } = req.query;
      page = parseInt(page) || 1; // default page is 1
      limit = 10; // default limit is 10
      const offset = (page - 1) * limit;
      const users = await models.User.findAll({
        offset,
        limit,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        order: [["id", "DESC"]],
      });
      res.json({ data: users, status: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createUser: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { originalname, buffer } = req.file;
      const base64Data = buffer.toString("base64"); // Convert buffer to Base64
      req.body.profile = base64Data;
      const data = await models.User.create(req.body);
      res.status(201).send({
        status: true,
        message: "User created successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { originalname, buffer } = req.file;
      const base64Data = buffer.toString("base64"); // Convert buffer to Base64
      req.body.profile = base64Data;
      const id = req.query.id;
      const data = await models.User.update(req.body, {
        where: {
          id,
        },
        returning: true,
      });
      res.status(200).send({
        status: true,
        message: "User updated successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteUser: async (req, res, next) => {
    const id = req.query.id;
    try {
      const deletedUser = await models.User.destroy({ where: { id } });
      if (deletedUser === 1) {
        res.status(200).send({
          status: true,
          message: "User Deleted Successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
  getUser: async (req, res, next) => {
    const id = req.query.id;
    try {
      const data = await models.User.findOne({ where: { id } });
      res.status(200).send({
        status: true,
        data,
      });
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await models.User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.status(200).send({
        status: true,
        message: "Logged In Successful",
      });
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },
  sendMail: async (req, res, next) => {
    const { email } = req.body;
    try {
      const user = await models.User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }


      const templateData = {
        name: user.name,
        layout: false,
      };
      console.log("path", path.join(__dirname, "../views/email-template"));
      // Render the HTML template using express-handlebars directly
      const html = await new Promise((resolve, reject) => {
        hbs.renderView(
          path.join(__dirname, "../views/email-template.hbs"),
          templateData,
          (err, html) => {
            if (err) reject(err);
            resolve(html);
          }
        );
      });

      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Test Email for Nodemailer",
        html: html,
      };

      // Send email using the email service
      await emailService.sendEmail(mailOptions);

      // Respond with success message
      res.status(200).json({
        status: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  },
};
