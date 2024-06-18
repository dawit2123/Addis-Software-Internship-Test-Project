import mongoose from "mongoose";
import {getAllMusics, findMusicById,deleteMusicStatic, findMusicAndUpdate} from './statics.js'; 
import { createMusicMethod } from "./methods.js";
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

  //adding a create music method
  musicSchema.methods.createMusicMethod=createMusicMethod;

  //adding methods
  musicSchema.statics.getAllMusics=getAllMusics;

  musicSchema.statics.findMusicById=findMusicById;
  
  musicSchema.statics.findMusicAndUpdate=findMusicAndUpdate;
 musicSchema.statics.deleteMusicStatic=deleteMusicStatic;
  export default musicSchema;