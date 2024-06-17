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

  //adding a create music method
  musicSchema.methods.createMusicMethod= async function(req){
    return await this.save();
   }

  //adding methods
  musicSchema.statics.getAllMusics= async function(){
    return await this.find();
  }

  musicSchema.statics.findMusicById= async function(id){
    return await this.findById(id);
  }
  
  musicSchema.statics.findMusicAndUpdate= async function(req){
    return await this.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    )
  }
 musicSchema.statics.deleteMusicStatic= async function(id){
  return await this.findByIdAndDelete(id);
 }
  export default musicSchema;