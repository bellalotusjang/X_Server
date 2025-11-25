import MongoDB from "mongodb";
import { getUsers } from "../db/database.mjs";
import * as UserRepository from "./auth.mjs";
import { getPosts } from "../db/database.mjs";

const ObjectId = MongoDB.ObjectId;

// 모든 포스트를 리턴
export async function getAll() {
  return getPosts().find().sort({ createAt: -1 }).toArray();
}

// 사용자 아이디(user id)에 대한 포스트를 리턴
export async function getAllByUserid(userid) {
  return getPosts().find({ userid }).sort({ createAt: -1 }).toArray();
}

// 글 번호(id)에 대한 포스트를 리턴
export async function getById(id) {
  return getPosts()
    .find({ _id: new ObjectId(id) })
    .next()
    .then(mapOptionalPost);
}

// id는 단일 데이터이기 때문에 filter를 쓸 필요 없음
// Filter 와 validator가 다른 이유: 필터는 전체를 훑어서 필요한 값만 추출,
// validator는 한 문단의 검열할 값만 실행

// 포스트를 작성
export async function create(text, id) {
  return UserRepository.findById(id)
    .then((user) =>
      getPosts().insertOne({
        text,
        createAt: new Date(),
        idx: user.id,
        name: user.name,
        userid: user.userid,
        url: user.url,
      })
    )
    .then((result) => {
      return getPosts().findOne({ _id: result.insertedId });
    });
}

// 포스트를 변경
export async function update(id, text) {
  return getPosts()
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { text } },
      { returnDocument: "after" }
    )
    .then((result) => result);
}

// 포스트 삭제
export async function remove(id) {
  return getPosts().deleteOne({ _id: new ObjectId(id) });
}

function mapOptionalPost(post) {
  return post ? { ...post, id: post._id.toString() } : post;
}
