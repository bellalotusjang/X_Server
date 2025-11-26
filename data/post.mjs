import mongoose from "mongoose";
import { userVirtualId } from "../db/database.mjs";
import * as UserRepository from "./auth.mjs";

const postSchema = new mongoose.Schema(
  {
    text: { type: String, require: true },
    userIdx: { type: String, requrie: true },
    name: { type: String, require: true },
    userid: { type: String, require: true },
    url: String,
  },
  {
    timestamps: true,
  }
);

userVirtualId(postSchema);
const Post = mongoose.model("post", postSchema);

// 모든 포스트를 리턴
export async function getAll() {
  return Post.find().sort({ createdAt: -1 });
}

// 사용자 아이디(user id)에 대한 포스트를 리턴
export async function getAllByUserid(userid) {
  return Post.find({ userid }).sort({ createAt: -1 });
}

// 글 번호(id)에 대한 포스트를 리턴
export async function getById(id) {
  return Post.findById(id);
}

// // id는 단일 데이터이기 때문에 filter를 쓸 필요 없음
// // Filter 와 validator가 다른 이유: 필터는 전체를 훑어서 필요한 값만 추출,
// // validator는 한 문단의 검열할 값만 실행

// 포스트를 작성
export async function create(text, id) {
  return UserRepository.findById(id).then((user) =>
    new Post({
      text,
      userIdx: user.id,
      name: user.name,
      userid: user.userid,
      url: user.url,
    }).save()
  );
}

// 포스트를 변경
export async function update(id, text) {
  return Post.findByIdAndUpdate(id, { text }, { returnDocument: "after" });
}

// 포스트 삭제
export async function remove(id) {
  return Post.findByIdAndDelete(id);
}

// function mapOptionalPost(post) {
//   return Post.findByIdAndUpdate
// }
