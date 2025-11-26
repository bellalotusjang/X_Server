import MongoDB from "mongodb";
import { userVirtualId } from "../db/database.mjs";
import mongoose from "mongoose";
// versionKey: Mongoose가 문서를 저장할 때 자동으로 추가하는 _v라는 필드를 설정
const userSchema = new mongoose.Schema(
  {
    userid: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, requre: true },
    url: String,
  },
  { versionKey: false }
);

userVirtualId(userSchema);
const User = mongoose.model("user", userSchema);
// 단수로 적으면 나중에 복수로 바껴서 화면에 출력 why??????????????

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}

// export async function login(userid, password) {
//   const user = users.find(
//     (user) => user.userid === userid && user.password === password
//   );
//   console.log(user);
//   return user;
// }

export async function findByUserid(userid) {
  return User.findOne({ userid });
}

export async function findById(id) {
  return User.findById(id);
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
