import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

export const Music = mongoose.model("Music", musicSchema);
