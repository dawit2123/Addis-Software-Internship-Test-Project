export const getAllMusics = async function (id) {
  return await this.find({ addedBy: id });
};
export const getAllUsersMusics = async function (id) {
  return await this.find();
};

export const findMusicById = async function (id, userDataId) {
  return await this.findById({ _id: id, addedBy: userDataId });
};
export const findMusicAndUpdate = async function (req) {
  return await this.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
};
export const deleteMusicStatic = async function (id) {
  return await this.findByIdAndDelete(id);
};
