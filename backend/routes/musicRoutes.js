import express from "express";
import { uploadFiles } from "../controllers/musicController.js";
import { processFiles } from "../controllers/musicController.js";
import { checkPermission } from "../controllers/authController.js";
import validateSong from "../validate/validateMusic.js";
import {
  createMusic,
  deleteMusic,
  getMusics,
  getAllUsersMusic,
  updateMusic,
} from "../controllers/musicController.js";

// Middleware to check permissions
const musicRouter = express.Router();

musicRouter.get(
  "/get-all-users-music",
  checkPermission("readAny", "music"),
  getAllUsersMusic
);
musicRouter
  .route("/")
  .get(checkPermission("readOwn", "music"), getMusics)
  .post(
    checkPermission("createOwn", "music"),
    uploadFiles,
    validateSong,
    processFiles,
    createMusic
  );
musicRouter
  .route("/:id")
  .patch(checkPermission("updateOwn", "music"), updateMusic)
  .delete(checkPermission("deleteOwn", "music"), deleteMusic);

export default musicRouter;
