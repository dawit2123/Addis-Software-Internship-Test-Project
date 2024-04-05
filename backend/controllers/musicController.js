import asyncHandler from "express-async-handler";
import { Music } from "../models/musicModel.js";
import multer from "multer";
import sharp from "sharp";
// @desc    Get all Musics
// @route   GET /api/Musics
// @access  Public
export const getMusics = asyncHandler(async (req, res) => {
  const data = await Music.find();
  res.status(200).json({
    status: "success",
    data: data,
  });
});

// @desc    Create single Music
// @route   POST /api/Musics/
// @access  Public
export const createMusic = asyncHandler(async (req, res) => {
  console.log(req.body);
  let required_fields = ["title", "artistName", "duration", "musicName"];
  let errors = [];
  required_fields.forEach((field) => {
    if (!req.body[field]) errors.push(field + " is required!");
  });
  console.log(req.body);
  req.file.filename = `${req.body.title.replace(" ", "-")}-music.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/music/${req.file.filename}.jpeg`);

  if (errors.length !== 0) {
    res.status(400).json({ message: errors });
  } else {
    const data = await Music.create({
      title: req.body.title,
      artistName: req.body.artistName,
      duration: req.body.duration,
      coverImage: req.file.filename,
      musicName: req.body.musicName,
    });
    res.status(200).json(data);
  }
});

export const uploadFile = asyncHandler(async (req, res, next) => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(
        new AppError("Not an image! Please upload only music images.", 400),
        false
      );
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  }).single("coverImage");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    next();
  });
});
// @desc    Update single Music
// @route   PATCH /api/Musics/:id
// @access  Public
export const updateMusic = asyncHandler(async (req, res) => {
  const data = await Music.findById(req.params.id);

  if (!data) {
    res.status(404).json({ message: "Music not found!" });
  } else {
    const updatedMusic = await Music.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedMusic);
  }
});

// @desc    Delete single Music
// @route   DELETE /api/Musics/:id
// @access  Public
export const deleteMusic = asyncHandler(async (req, res) => {
  const data = await Music.findById(req.params.id);

  if (!data) {
    res.status(404).json({ message: "Music not found!" });
  } else {
    await Music.remove();
    res.status(200).json({ id: req.params.id, message: "Music deleted!" });
  }
});
