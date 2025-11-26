import express from "express";
import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
async function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;

  // 회원 중복 체크
  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(409).json({ message: `${userid}이 이미 있습니다` });
  }

  const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds);
  const user = await authRepository.createUser({
    userid,
    password: hashed,
    name,
    email,
  });
  //   const user = await authRepository.createUser(userid, password, name, email);
  const token = await createJwtToken(user.id);
  console.log(token);
  res.status(201).json({ token, user });
}
export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.findByUserid(userid);
  if (!user) {
    res.status(401).json(`${userid} 를 찾을 수 없음`);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: `아이디 또는 비밀번호 확인` });
  }
  const token = await createJwtToken(user.id);
  res.status(200).json({ token, user });
}
export async function me(req, res, next) {
  const user = await authRepository.findById(req.id);
  if (!user) {
    return res.status(404).json({ message: "일치하는 사용자가 없음" });
  }
  res.status(200).json({ token: req.token, userid: user.userid });
  // res.status(200).json({ message: "성공했어 ~" });
}

// 강사님 회원가입 ver
// export async function signup(req, res, next) {
//     const {userid, password,name,email} = req.body;
//     const users = await authRepository.createUser(userid, password, name, email);
//     if (users) {
//         res.status(201).json(users);
//     }

// 내가 쓴 회원가입 ver
// export async function createId(req, res, next) {
//     const { userid, name, password, email} = req.body;
//     const createId = await authRepository.createId(userid, name, password, email);
//     if (createId){
//         res.status(200).json({message: `${userid}회원가입이 되었습니다.`});
//     } else {
//         res.status(404).json({message:`${userid}이미 사용중인 아이디입니다.`});
// }
// }

//강사님 로그인 ver

// export async function login(req, res, next) {
//   const { userid, password } = req.body;
//   const user = await authRepository.login(userid, password);
//   if (user) {
//     res.status(200).json(`${userid}님 로그인 되었습니다.`);
//   } else {
//     res
//       .status(404)
//       .json({ message: `${userid}님 아이디 또는 비밀번호를 확인하세요` });
//   }
// }

// 내가 쓴 로그인 ver
// export async function login(req,res,next) {
//     const {id, password} = req.body;
//     const login = await authRepository.getById(id, password);
//     if (login){
//         res.status(200).json(post);
//     } else {
//         res.status(404).json({message:`${id}로그인 정보가 없습니다`});
//     }
// }
