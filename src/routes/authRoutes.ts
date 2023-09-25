import { Router } from "express";
import { register, login } from "../controllers/authControllers";
import { checkDuplicateUser } from "../middlewares/authMiddleware";

const router = Router();

// *@desc   -->  Create a new user account
// *@route  -->  POST /api/v1/auth/register
// *@access -->  PUBLIC
router.route("/register").post(checkDuplicateUser, register);

// *@desc -->  Login to a user account
// *@route -->  POST /api/v1/auth/login
// *@access --> PUBLIC
router.route("/login").post(login);

export default router;
