import asyncHandler from "express-async-handler";
import { Music } from "../models/musicModel.js";
import multer from "multer";
import sharp from "sharp";

export const getMusics = asyncHandler(async (req, res) => {
  const data = await Music.find();
  res.status(200).send(data);
});

export const createMusic = asyncHandler(async (req, res) => {
  let required_fields = ["title", "artistName", "duration"];
  let errors = [];
  required_fields.forEach((field) => {
    if (!req.body[field]) errors.push(field + " is required!");
  });

  if (errors.length !== 0) {
    res.status(400).json({ message: errors });
  } else {
    const data = await Music.create({
      title: req.body.title,
      artistName: req.body.artistName,
      duration: req.body.duration,
      coverImage: req.file.imageName,
    });
    res.status(200).json(data);
  }
});

export const processImage = asyncHandler(async (req, res, next) => {
  req.file.imageName = `${Date.now()}-music`;
  await sharp(req.file.buffer)
    .resize(3024, 4032)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/music/${req.file.imageName}.jpeg`);
  next();
});
export const uploadImageFile = asyncHandler(async (req, res, next) => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(
        new AppError("Not an image! Please upload only music image.", 400),
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

export const deleteMusic = asyncHandler(async (req, res) => {
  const data = await Music.findById(req.params.id);
  if (!data) {
    res.status(404).json({ message: "Music not found!" });
  } else {
    await Music.deleteOne({ _id: req.params.id });
    res.status(200).json({ id: req.params._id, message: "Music deleted!" });
  }
});
