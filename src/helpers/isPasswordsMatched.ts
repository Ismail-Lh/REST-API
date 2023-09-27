import bcrypt from "bcryptjs";

const isPasswordsMatched = async (
  enteredPassword: string,
  userPassword: string
) => await bcrypt.compare(enteredPassword, userPassword);

export default isPasswordsMatched;
