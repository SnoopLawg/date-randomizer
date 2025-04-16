import { body } from "express-validator";

const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name cannot be empty if provided"),
  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name cannot be empty if provided"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export { registerValidation, loginValidation };
