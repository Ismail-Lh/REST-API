import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/userControllers";

const router = Router();

// *@desc   -->  Get all users
// *@route  -->  GET /api/v1/users
// *@access -->  public for now
// TODO: make this route private (ADMIN ONLY)
router.route("/").get(getAllUsers);

// *@desc   --> Get user by name
// *@route  --> GET /api/v1/users/:username
// *@access --> public
router.route("/:username").get(getUser);

export default router;
