export const getAllMusics = async function (id) {
  return await this.find({ addedBy: id });
};
export const findMusicById = async function (id) {
  return await this.findById(id);
};
export const findMusicAndUpdate = async function (req) {
  return await this.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
};
export const deleteMusicStatic = async function (id) {
  return await this.findByIdAndDelete(id);
};
