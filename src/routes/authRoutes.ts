import { Router } from "express";
import { register } from "../controllers/authControllers";
import { checkDuplicateUser } from "../middlewares/authMiddleware";

const router = Router();

// *@desc   -->  Create a new user account
// *@route  -->  POST /api/v1/auth/register
// *@access -->  PUBLIC
router.route("/register").post(checkDuplicateUser, register);

export default router;
