export const getAllMusics= async function(){
    return await this.find();
  }
export const findMusicById= async function(id){
    return await this.findById(id);
  }
export const findMusicAndUpdate= async function(req){
    return await this.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    )
  }
export const deleteMusicStatic= async function(id){
    return await this.findByIdAndDelete(id);
   }