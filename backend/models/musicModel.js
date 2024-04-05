import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A music must have a title"],
    },
    artistName: {
      type: String,
      required: [true, "A music must have an artist name"],
    },
    duration: {
      type: Number,
      required: [true, "A music must have a duration"],
    },
    coverImage: {
      type: String,
      required: [true, "A music must have a cover image"],
    },
    musicName: {
      type: String,
      required: [true, "A music must have a music name"],
    },
  },
  { timestamps: true }
);

export const Music = mongoose.model("Music", musicSchema);
