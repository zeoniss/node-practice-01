const express = require("express");
const Joi = require("joi");
const router = new express.Router();

let posts = [
  { id: "1", topic: "test1", text: "test text1" },
  { id: "2", topic: "test2", text: "test text2" },
  { id: "3", topic: "test3", text: "test text3" },
];

//получение всего списка постов GET/api/posts
router.get("/", (req, res) => {
  res.json({ posts, status: "success" });
});
//GET /api/posts/<123> => {posts with id 123}
//фильтруем где будет такой
//же id какой нам прислали
//в параметрах запроса
//достаем параметр который прислал пользователь.
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const [post] = posts.filter((item) => item.id === id);
  //если post не был найден
  if (!post) {
    return res
      .status(400)
      .json({ status: `failure, no post with id '${id}' found ` });
  }
  res.json({ post, status: "success" }); //отдаем параметр пользователю
});
//Добавление поста POST /api/posts => [newPost, ...posts]

router.post("/", (req, res) => {
  //параметры которые мы будем ожидать от пользователя в теле запроса
  const { topic, text } = req.body;
  const schema = Joi.object({
    topic: Joi.string().alphanum().min(3).max(30).required(),
    text: Joi.string().alphanum().min(10).max(400).required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
  }
  //в массив добавляем новый элемент
  posts.push({
    id: new Date().getTime().toString(),
    topic,
    text,
  });
  //ответ пользователю
  res.json({ status: "success" });
});

//Изменение поста по id POST /api/posts/123 => [changePost, ...posts]

router.patch("/:id", (req, res) => {
  const { topic, text } = req.body;

  //Находим нужный элемент
  posts.forEach((post) => {
    //если id текущего поста в массиве который мы перебираем = тому что нам прислал пользователь
    if (post.id === req.params.id) {
      if (topic) {
        post.topic = topic;
      }
      if (text) {
        text.topic = text;
      }
    }
  });
  res.json({ status: "success" });
});

//DELETE /api/posts/123 => [post without post with id 123]

router.delete("/:id", (req, res) => {
  posts = posts.filter((item) => item.id !== req.params.id);
  res.json({ status: "success" });
});

module.exports = { postsRouter: router };
