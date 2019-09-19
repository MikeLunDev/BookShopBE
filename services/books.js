const express = require("express");
const fs = require("fs-extra");
const shortid = require("shortid");
const pdfTemplate = require("../templates");
const pdf = require("html-pdf");
const { join } = require("path");

getBooks = async () => {
  var buffer = await fs.readFile("books.json");
  var items = buffer.toString();
  return JSON.parse(items);
};

saveBooks = async books => {
  await fs.writeFile("books.json", books);
};

const router = express.Router();

router.post("/create-pdf", (req, res) => {
  pdf
    .create(pdfTemplate(req.body), {})
    .toFile(`result${req.body.asin}.pdf`, (err, res) => {
      if (err) {
        res.send(err);
      } else res.send();
    });
});

router.get("/get-pdf", (req, res) => {
  try {
    res.sendFile(join(__dirname, `result${req.body.asin}.pdf`));
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  var books = await getBooks();

  console.log(req.query);
  for (let entry in req.query) {
    var queryValue = req.query[entry].toLowerCase
      ? req.query[entry].toLowerCase()
      : req.query[entry];
    books = books.filter(x =>
      x[entry].toLowerCase
        ? x[entry].toLowerCase().indexOf(queryValue) >= 0
        : x[entry] == queryValue
    );

    // if (req.query.toLowerCase)
    //     books = books.filter(x => x[entry].toLowerCase().indexOf(req.query[entry].toLowerCase()) >= 0);
    // else
    //     books = books.filter(x => x[entry] == req.query[entry]

    console.log(entry + " => " + queryValue + " array size: " + books.length);
  }

  res.send(books);
});

router.get("/:id", async (req, res) => {
  var books = await getBooks();
  res.send(books.find(x => x.asin == req.params.id));
});

router.post("/", async (req, res) => {
  var books = await getBooks();
  if (!req.body.asin) req.body.asin = shortid.generate();

  books.push(req.body);
  await saveBooks(books);
});

router.put("/:id", async (req, res) => {
  var books = await getBooks();
  //[1 ,2 , 5, 7]
  //--------^
  // 5
  var book = books.find(x => x.asin == req.params.id);
  Object.assign(book, req.body);

  await saveBooks(books);
});

router.delete("/:id", async (req, res) => {
  var books = await getBooks();
  //[1 ,2 , 5, 7]
  //--------X
  //[1 ,2 , 7]
  var booksWithoutSpecifiedID = books.filter(x => x.asin != req.params.id);
  await saveBooks(booksWithoutSpecifiedID);
});

module.exports = router;
