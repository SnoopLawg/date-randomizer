import express from "express";
import { validationResult } from "express-validator";
import AuthService from "../services/auth.js";
import { registerValidation, loginValidation } from "../utils/validators.js";
import auth from "../middleware/auth.js";
import { User } from "../models/index.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  console.log("\n=== Registration Request ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("Request headers:", JSON.stringify(req.headers, null, 2));

  try {
    console.log("Calling AuthService.register...");
    const result = await AuthService.register(req.body);
    console.log("✅ Registration successful:", JSON.stringify(result, null, 2));
    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error stack:", error.stack);
    res.status(400).json({ error: error.message });
  }
  console.log("=== End Registration Request ===\n");
});

// Login user
router.post("/login", loginValidation, async (req, res) => {
  console.log("\n=== Login Request ===");
  console.log("Email:", req.body.email);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(
        "❌ Login validation failed:",
        JSON.stringify(errors.array(), null, 2)
      );
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    console.log("✅ Login successful for user:", email);
    res.json(result);
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(401).json({ error: error.message });
  }
  console.log("=== End Login Request ===\n");
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "last_login",
      ],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout user (client-side should remove token)
router.post("/logout", auth, async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
