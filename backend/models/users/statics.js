export const signupUser = async function (obj) {
  return await this.create(obj);
};
export const findUser = async function (email) {
  return this.findOne({ email }).select("+password");
};
