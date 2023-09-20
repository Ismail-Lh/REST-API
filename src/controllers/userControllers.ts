import User from "../models/User";

export const getUsers = async () => await User.find();

export const getUserByEmail = async (req, res) => {};
