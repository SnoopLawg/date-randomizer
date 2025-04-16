import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

class AuthService {
  static async register(userData) {
    console.log("\n=== AuthService.register ===");
    console.log("Input userData:", JSON.stringify(userData, null, 2));

    const { email, password, first_name, last_name } = userData;

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Check if user already exists
    console.log("Checking for existing user with email:", email);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("❌ User already exists with email:", email);
      throw new Error("User with this email already exists");
    }

    // Generate username from email
    let username = email.split("@")[0];
    console.log("Initial username generated:", username);

    // Ensure username meets length requirements
    if (username.length < 3) {
      username = username.padEnd(3, "0");
      console.log("Username padded to meet minimum length:", username);
    }
    if (username.length > 30) {
      username = username.substring(0, 30);
      console.log("Username truncated to meet maximum length:", username);
    }

    let usernameExists = await User.findOne({ where: { username } });
    let counter = 1;

    while (usernameExists) {
      console.log(
        `Username '${username}' already exists, trying with counter:`,
        counter
      );
      username = `${email.split("@")[0]}${counter}`;
      if (username.length > 30) {
        username = username.substring(0, 30 - String(counter).length) + counter;
      }
      usernameExists = await User.findOne({ where: { username } });
      counter++;
    }
    console.log("Final username generated:", username);

    try {
      console.log("Hashing password...");
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      console.log("Creating user in database...");
      const user = await User.create({
        email,
        username,
        password_hash,
        first_name: first_name || "",
        last_name: last_name || "",
      });

      console.log(
        "✅ User created successfully:",
        JSON.stringify(
          {
            id: user.id,
            email: user.email,
            username: user.username,
          },
          null,
          2
        )
      );

      // Generate token
      console.log("Generating JWT token...");
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const result = {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      };
      console.log(
        "✅ Registration complete. Returning result:",
        JSON.stringify(result, null, 2)
      );
      console.log("=== End AuthService.register ===\n");
      return result;
    } catch (error) {
      console.error("❌ Error creating user:", error);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }

  static async login(email, password) {
    console.log("\n=== AuthService.login ===");
    console.log("Attempting login for email:", email);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("❌ No user found with email:", email);
      throw new Error("Invalid login credentials");
    }

    console.log("Checking password...");
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", email);
      throw new Error("Invalid login credentials");
    }

    // Update last login
    console.log("Updating last login timestamp...");
    await user.update({ last_login: new Date() });

    const token = this.generateToken(user);
    console.log("✅ Login successful for user:", email);

    const result = {
      user: this.sanitizeUser(user),
      token,
    };
    console.log("=== End AuthService.login ===\n");
    return result;
  }

  static generateToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  static sanitizeUser(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }
}

export default AuthService;
