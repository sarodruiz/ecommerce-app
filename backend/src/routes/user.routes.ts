import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", (req, res) => {
    res.status(200).json({ message: "Welcome to login route" });
});

export default router;
