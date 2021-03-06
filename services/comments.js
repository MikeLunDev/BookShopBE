const express = require("express");
const fs = require("fs-extra");
const shortid = require("shortid");

const getComments = async () => {
  var buffer = await fs.readFile("comments.json");
  var items = buffer.toString();
  return JSON.parse(items);
};

const saveComments = async books => {
  await fs.writeFile("comments.json", books);
};

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("i'm here");
  var listOfComments = await getComments();
  res.send(listOfComments);
});

router.post("/:bookid", async (req, res) => {
  var newComment = req.body;
  newComment.Date = new Date();
  newComment.BookID = req.params.bookid;
  newComment._id = shortid.generate();
  var listOfComments = await getComments();
  listOfComments.push(newComment);
  await saveComments(JSON.stringify(listOfComments));
  res.send(newComment);
});

router.get("/:bookid", async (req, res) => {
  var listOfComments = await getComments();

  var filteredComments = listOfComments.filter(
    comment => comment.BookID === req.params.bookid
  );
  if (filteredComments.length) {
    res.send(filteredComments);
  } else res.status(404).send(filteredComments);
});

router.delete("/:commentid", async (req, res) => {
  var listOfComments = await getComments();
  var filteredComments = listOfComments.filter(
    comm => comm._id !== req.params.commentid
  );
  await saveComments(JSON.stringify(filteredComments));
  res.send("deleted");
});

module.exports = router;
