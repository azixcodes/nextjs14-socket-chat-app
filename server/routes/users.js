import express from "express";
import {
  getUsers,
  saveUser,
  handleSignIn,
  handleEmailLogin,
  sendMessage,
  getUserChats,
  getSingleUser,
  // getSingleUser,
  // deleteuser,
  // signIn,
} from "../controllers/users.js";
const router = express.Router();

router.get("/", getUsers);
router.post("/", saveUser);
router.post("/sign-in", handleSignIn);
router.post("/auth", handleEmailLogin);
router.post("/chat", sendMessage);
router.get("/chat/:id/", getUserChats);
router.get("/:id", getSingleUser);
// router.get("/user/:id", getSingleUser);
// router.delete("/user/:id", deleteuser);
// router.post("/sign-in", signIn);
export default router;
