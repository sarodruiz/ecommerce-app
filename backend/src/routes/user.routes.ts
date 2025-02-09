import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
    res.status(200).json({ message: "User registration api" });
});

export default router;
