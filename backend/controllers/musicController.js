import catchAsync from "../utils/catchAsync.js";
import { Music } from "../models/musics/musicModel.js";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import mp3Duration from "mp3-duration";
let audioFilePathGlobal;

export const getMusics = catchAsync(async (req, res) => {
  const data = await Music.getAllMusics(req.userData._id);
  res.status(200).json({
    status: "success",
    data,
  });
});

export const getAllUsersMusic = catchAsync(async (req, res) => {
  const data = await Music.getAllUsersMusics();
  res.status(200).json({
    status: "success",
    data,
  });
});

export const createMusic = catchAsync(async (req, res, next) => {
  let required_fields = ["title", "artistName"];
  let errors = [];
  let durationOfMusic = "";
  await mp3Duration(`${audioFilePathGlobal}`, function (err, duration) {
    if (err) return console.log(err.message);
    durationOfMusic = `${
      duration > 60
        ? parseInt(duration / 60) < 10
          ? `0${parseInt(duration / 60)}`
          : parseInt(duration / 60)
        : "00"
    }:${
      duration > 60
        ? parseInt(duration % 60) < 10
          ? `0${parseInt(duration % 60)}`
          : parseInt(duration % 60)
        : parseInt(duration) < 10
        ? `0${parseInt(duration)}`
        : parseInt(duration)
    }`;
  });
  required_fields.forEach((field) => {
    if (!req.body[field]) errors.push(field + " is required!");
  });
  if (errors.length !== 0) {
    res.status(400).json({
      status: "fail",
      data: errors,
    });
  } else {
    const data = await new Music({
      title: req.body.title,
      artistName: req.body.artistName,
      duration: req.body.duration,
      coverImage: req.files["coverImage"].originalname,
      audioFile: req.files["audioFile"].originalname,
      addedBy: req.userData._id,
    }).createMusicMethod();
    res.status(200).json({
      status: "success",
      data,
    });
  }
});

export const processFiles = catchAsync(async (req, res, next) => {
  req.files["coverImage"].originalname = `${Date.now()}-music`;
  req.files["audioFile"].originalname = `${Date.now()}-audio.mp3`;
  await sharp(req.files["coverImage"][0].buffer)
    .resize(3024, 4032)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(
      `${req.homedir}/public/img/music/${req.files["coverImage"].originalname}.jpeg`
    );
  // Convert audio buffer to file and store it
  const audioFilePath = `${req.homedir}/public/audio/music/${req.files["audioFile"].originalname}`;
  audioFilePathGlobal = audioFilePath;
  await fs.writeFile(
    audioFilePath,
    req.files["audioFile"][0].buffer,
    "binary",
    (err) => {
      if (err) {
        console.error("Error writing audio file:", err);
        return next(err);
      }
    }
  );
  next();
});
export const uploadFiles = catchAsync(async (req, res, next) => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("audio")
    ) {
      cb(null, true);
    } else {
      cb(next(new Error("Please upload only image or audio files.")), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  }).fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]);

  upload(req, null, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }
    next();
  });
});

export const updateMusic = catchAsync(async (req, res) => {
  const data = await Music.findMusicById(req.params.id, req.userData._id);

  if (!data) {
    res.status(404).json({
      status: "fail",
      message: "Music not found!",
    });
  } else {
    const updatedMusic = await Music.findMusicAndUpdate(req);
    res.status(200).json({
      status: "success",
      updatedMusic,
    });
  }
});

export const deleteMusic = catchAsync(async (req, res) => {
  const data = await Music.findById(req.params.id, req.userData._id);
  const audioFilePath = `${req.homedir}/public/audio/music/${data.audioFile}`;
  const imageFilePath = `${req.homedir}/public/img/music/${data.coverImage}.jpeg`;

  fs.unlink(audioFilePath, (err) => {
    if (err) {
      console.error("Error deleting the audio", err);
      return;
    }
  });
  fs.unlink(imageFilePath, (err) => {
    if (err) {
      console.error("Error deleting the image", err);
      return;
    }
  });
  if (!data) {
    res.status(404).json({
      status: "fail",
      message: "Music not found!",
    });
  } else {
    await Music.deleteMusicStatic(req.params.id);
    res.status(200).json({
      status: "success",
      id: req.params._id,
      message: "Music deleted!",
    });
  }
});
