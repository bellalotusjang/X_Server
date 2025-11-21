import express from "express";
import * as authRepository from "../data/auth.mjs";

// 강사님 회원가입 ver
export async function signup(req, res, next) {
    const {userid, password,name,email} = req.body;
    const users = await authRepository.createUser(userid, password, name, email);
    if (users) {
        res.status(201).json(users);
    }

}

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

export async function login(req, res, next) {
    const {userid, password} = req.body;
    const user = await authRepository.login(userid, password);
    if(user){
        res.status(200).json(`${userid}님 로그인 되었습니다.`);
    } else {
        res
        .status(404)
        .json({message: `${userid}님 아이디 또는 비밀번호를 확인하세요`});
    }
    }

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

