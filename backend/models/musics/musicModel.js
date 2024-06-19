import mongoose from "mongoose";
import musicSchema from "./musicSchema.js";


export const Music = mongoose.model("Music", musicSchema);
