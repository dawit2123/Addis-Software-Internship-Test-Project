import Joi from "joi";
import { fileTypeFromBuffer } from "file-type";

const songValidation = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    "string.base": "Title should be a type of text",
    "string.empty": "Title cannot be an empty field",
    "string.min": "Title should have a minimum length of {#limit}",
    "string.max": "Title should have a maximum length of {#limit}",
    "any.required": "Title is a required field",
  }),
  artistName: Joi.string().min(3).max(50).required().messages({
    "string.base": "Artist Name should be a type of text",
    "string.empty": "Artist Name cannot be an empty field",
    "string.min": "Artist Name should have a minimum length of {#limit}",
    "string.max": "Artist Name should have a maximum length of {#limit}",
    "any.required": "Artist Name is a required field",
  }),
  duration: Joi.string().min(3).max(7).required().messages({
    "string.base": "Duration should be a type of text",
    "string.empty": "Duration cannot be an empty field",
    "string.min": "Duration should have a minimum length of {#limit}",
    "string.max": "Duration should have a maximum length of {#limit}",
    "any.required": "Duration is a required field",
  }),
  coverImage: Joi.binary().custom(async (value, helpers) => {
    const maxSize = 8 * 1024 * 1024;
    if (value.length > maxSize) {
      return helpers.message("Cover image must be less than or equal to 8MB");
    }
    const type = await fileTypeFromBuffer(value);
    if (!type || type.mime !== "image/jpeg" || type.mime !== "image/png") {
      return helpers.message("Cover image must be a JPEG or PNG image");
    }
    return value;
  }, "File Size Validation"),
  audioFile: Joi.binary().custom(async (value, helpers) => {
    const maxSize = 10 * 1024 * 1024;
    if (value.length > maxSize) {
      return helpers.message("Audio file must be less than or equal to 10MB");
    }
    const type = await fileTypeFromBuffer(value);
    if (!type || type.mime !== "audio/mpeg") {
      return helpers.message("audio file must be an MP3 file.");
    }
    return value;
  }, "File Size Validation"),
});
const validateSong = (req, res, next) => {
  const object = {
    title: req.body.title,
    artistName: req.body.artistName,
    duration: req.body.duration,
    coverImage: req.files["coverImage"][0].buffer,
    audioFile: req.files["audioFile"][0].buffer,
  };
  const { error } = songValidation.validate(object);
  if (error) {
    console.log(error);
    next(error.details[0]);
  } else {
    next();
  }
};

export default validateSong;
