const express = require('express')
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
//GET questions
app.get("/qa/questions", (req, res) => {
  const {product_id, page, count} = req.query;
  console.log(product_id, page, count);
  res.sendStatus(200);
})

//GET answers
app.get("/qa/questions/:questions_id/answers", (req, res) => {
  const {page, count} = req.query;
  const {questions_id} = req.params;
  console.log(questions_id, page, count)
  res.sendStatus(200);
})

//POST questions
app.post("/qa/questions", (req, res) => {
  const {body, name, email, product_id} = req.body;
  console.log(body, name, email, product_id);
  res.sendStatus(200);
});

//POST answers
app.post("/qa/questions/:question_id/answers", (req, res) => {
  const {body, name, email, photos} = req.body;
  const {question_id} = req.params;
  console.log(question_id, body, email, photos);
  res.sendStatus(200);
});

//PUT question helpful
app.put("/qa/questions/:question_id/helpful", (req, res) => {
  const {question_id} = req.params;
  console.log("should mark question", question_id, "as helpful");
  res.sendStatus(200);
})

//PUT question report
app.put("/qa/questions/:question_id/report", (req, res) => {
  const {question_id} = req.params;
  console.log("should mark question", question_id, "as reported");
  res.sendStatus(200);
})

//PUT answer helpful
app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  const {answer_id} = req.params;
  console.log("should mark answer", answer_id, "as helpful");
  res.sendStatus(200);
})

//PUT answer report
app.put("/qa/answers/:answer_id/report", (req, res) => {
  const {answer_id} = req.params;
  console.log("should mark answer", answer_id, "as reported");
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`listening on port`, port);
})