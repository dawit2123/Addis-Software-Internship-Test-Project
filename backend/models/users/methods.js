import bcrypt from "bcryptjs";
export const verifyPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
