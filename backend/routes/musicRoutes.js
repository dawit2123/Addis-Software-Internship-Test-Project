import express from "express";
import { uploadImageFile } from "../controllers/musicController.js";
import { processImage } from "../controllers/musicController.js";
const router = express.Router();

import {
  createMusic,
  deleteMusic,
  getMusics,
  updateMusic,
} from "../controllers/musicController.js";

router
  .route("/")
  .get(getMusics)
  .post(uploadImageFile, processImage, createMusic);
router.route("/:id").patch(updateMusic).delete(deleteMusic);

export default router;
