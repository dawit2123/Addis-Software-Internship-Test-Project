import mongoose from "mongoose";
import * as statics from "./statics.js";
import * as methods from "./methods.js";
const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A music must have a title"],
      unique: [true, "A music with this title already exists"],
    },
    artistName: {
      type: String,
      required: [true, "A music must have an artist name"],
    },
    duration: {
      type: String,
      required: [true, "A music must have a duration"],
    },
    coverImage: {
      type: String,
      required: [true, "A music must have a cover image"],
    },
    audioFile: {
      type: String,
      required: [true, "A music must have an audio file"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//adding a create music method
musicSchema.method(methods);

//adding methods
musicSchema.static(statics);
export default musicSchema;
