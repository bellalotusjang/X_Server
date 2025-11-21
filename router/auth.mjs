import express from "express";
import * as authController from "../controller/auth.mjs";

const router = express.Router();
// 회원가입
router.post("/signup", authController.signup);
// router.get("/signup", authController.signup);

// 로그인
router.post("/login", authController.login);

// 로그인 유지 체크

export default router;
