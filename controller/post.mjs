import * as postRepository from "../data/post.mjs";

// 모든 포스트를 가져오는 함수
export async function getPosts(req, res, next) {
  const userid = req.query.userid;
  const data = await (userid
    ? postRepository.getAllByUserid(userid)
    : postRepository.getAll());
  res.status(200).json(data);
}

// await : 데이터 통신할때 ex)10초 정도 걸리는 데이터가 있을 경우
// async : await가  1+1 관계

// 하나의 포스트를 가져오는 함수
export async function getPost(req, res, next) {
  const id = req.params.id;
  const post = await postRepository.getById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다` });
  }
}

// 포스트를 작성하는 함수
export async function createPost(req, res, next) {
  const { userid, name, text } = req.body;
  const post = await postRepository.create(userid, name, text);
  res.status(201).json(post);
}

// 포스트를 변경하는 함수
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const post = await postRepository.update(id, text);
  if (post) {
    res.status(201).json(post);
  } else {
    res.status(404).json({ message: `${id}의 포스트가 없습니다` });
  }
}

// 포스트를 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  await postRepository.remove(id);
  res.sendStatus(204);
}
