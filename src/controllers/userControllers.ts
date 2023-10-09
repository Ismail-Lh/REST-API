import isPasswordsMatched from "../helpers/isPasswordsMatched";
import User from "../models/User";
import {
  ExpressMiddleware,
  UpdateUserCredentials,
  UpdateUserRes,
} from "../types/types";

// *@desc   -->  Get all users
// *@route  -->  GET /api/v1/users
// *@access -->  public for now
export const getAllUsers: ExpressMiddleware = async (req, res) => {
  const users = await User.find().select("-password").lean();

  !users?.length
    ? res.status(400).json({ message: "No users found!" })
    : res.status(200).json({ users });
};

// *@desc   --> Get user by name
// *@route  --> GET /api/v1/users/:username
// *@access --> public
export const getUser: ExpressMiddleware = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username })
    .select("-password")
    .lean()
    .exec();

  !user
    ? res.status(404).json({
        message:
          "No user found with this name. Please enter another valid username.",
      })
    : res.status(201).json(user);
};

// *@desc   --> Update the current user profile
// *@route  --> PATCH /api/v1/users/update-current-user
// *@access --> private
export const updateCurrentUser: ExpressMiddleware<
  UpdateUserCredentials,
  UpdateUserRes
> = async (req, res) => {
  const { username, email } = req.body;
  const { payload } = req;

  const user = await User.findById(payload.userId).select("-password").exec();

  if (!user)
    res.status(404).json({ message: "User not found. Please try again." });

  if (user.username === username && user.email === email)
    res.status(200).json({ message: "User up to date" });

  user.username = username || user.username;
  user.email = email || user.email;

  await user.save();

  res.status(201).json({ message: "user updated successfully!", user });
};

// *@desc   --> Update the current user password
// *@route  --> PATCH /api/v1/users/update-password
// *@access --> private
export const updatePassword: ExpressMiddleware = async (req, res) => {
  const { userId } = req.payload;
  const newPassword = req.body.password as string;

  const user = await User.findById(userId).exec();

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    message: `${user.username} your password has successfully updated!`,
  });
};

// *@desc   --> Forgot password functionality
// *@route  --> POST /api/v1/users/forgot-password
// *@access --> public
export const forgotPassword: ExpressMiddleware = async (req, res) => {
  const { email } = req.body;

  if (!email) res.status(401).json({ message: "Email address is required!" });

  const user = await User.findOne({ email }).exec();

  if (!user)
    res.status(404).json({
      message: "Invalid email address. There is no user with this email.",
    });

  // @ts-ignore
  const resetToken = user.createPasswordResetToken();
  await user.save();

  // 3- Send the generated token to the user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/forgot-password/${resetToken}`;

  const emailMessage = `Forgot your password? Submit a PATCH request whit your new password and passwordConfirm to this url ${resetURL}.\nIf you didn't forgot your password, please ignore this email.`;

  await sendEmail({
    userEmail: user.email,
    subject: "Your password reset token (valid for 10 minute)",
    emailMessage,
    emailBody: `Please click <a href="${resetURL}">here</a> to reset your password.`,
  });

  res.status(200).json({
    success: "success",
    message: "Token sent to email address!",
  });
};
