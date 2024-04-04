import express from "express";
const router = express.Router();
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";

router.route("/").get(getUsers).post(createUser);
router.route("/:id").patch(updateUser).delete(deleteUser);

export default router;
