import express from "express";
import { uploadFiles } from "../controllers/musicController.js";
import { processFiles } from "../controllers/musicController.js";
import validateSong from "../validate/validateMusic.js";
import {
  createMusic,
  deleteMusic,
  getMusics,
  updateMusic,
} from "../controllers/musicController.js";

const musicRouter = express.Router();

musicRouter
  .route("/")
  .get(getMusics)
  .post(uploadFiles, validateSong, processFiles, createMusic);

musicRouter.route("/:id").patch(updateMusic).delete(deleteMusic);

export default musicRouter;
