import express from "express";
import { uploadFile } from "../controllers/musicController.js";
const router = express.Router();

import {
  createMusic,
  deleteMusic,
  getMusics,
  updateMusic,
} from "../controllers/musicController.js";

router.route("/").get(getMusics).post(uploadFile, createMusic);
router.route("/:id").patch(updateMusic).delete(deleteMusic);

export default router;
