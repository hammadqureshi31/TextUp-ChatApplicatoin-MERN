import express from "express";
import {
  handleGetUserDetails,
  handleLoginUser,
  handleSignOutUser,
  handleSignupUser,
  handleUserProfileSetup,
  handleFetchAvailableContacts,
  handleAddNewContact,
  handleForgotPassword,
  handleResetPassword,
} from "../controllers/userControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/signup", handleSignupUser);

router.post("/login", handleLoginUser);

router.get("/me",verifyUser, handleGetUserDetails);

// Secured Routes
router.post("/signout", verifyUser, handleSignOutUser);

router.post("/profile-setup/:userId", verifyUser, handleUserProfileSetup);

router.get("/available-contacts", verifyUser, handleFetchAvailableContacts);

router.post("/add-new-contact/:userId", verifyUser, handleAddNewContact);

router.post("/forgot-password", handleForgotPassword);

router.post("/reset-password/:userId", handleResetPassword);

export default router;
