import { Router } from "express";
import {
  getAllUsers,
  getUser,
  updateCurrentUser,
} from "../controllers/userControllers";
import {
  checkDuplicateUser,
  protectedRoutes,
} from "../middlewares/authMiddleware";

const router = Router();

// !: ALL routes after this middleware are protected
router.use(protectedRoutes);

// *@desc   -->  Get all users
// *@route  -->  GET /api/v1/users
// *@access -->  public for now
// TODO: make this route private (ADMIN ONLY)
router.route("/").get(getAllUsers);

// *@desc   --> Get user by name
// *@route  --> GET /api/v1/users/:username
// *@access --> public
router.route("/:username").get(getUser);

// *@desc   --> Update the current user profile
// *@route  --> GET /api/v1/users/update-current-user
// *@access --> private
router
  .route("/update-current-user")
  .patch(checkDuplicateUser, updateCurrentUser);

export default router;
