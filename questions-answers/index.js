const newrelic = require('newrelic')
const express = require('express')
const cors = require('cors');
const {getQuestions, getAnswers, markQuestionHelpful, markAnswerHelpful, reportQuestion,
  reportAnswer, postQuestion, postAnswer} = require("./database/queries.js");
const app = express();
const port = 3000;

app.use(express.json());
//GET questions
app.get("/qa/questions", getQuestions);

//GET answers
app.get("/qa/questions/:question_id/answers", getAnswers)

//POST questions
app.post("/qa/questions", postQuestion);

//POST answers
app.post("/qa/questions/:question_id/answers", postAnswer);

//PUT question helpful
app.put("/qa/questions/:question_id/helpful", markQuestionHelpful)

//PUT question report
app.put("/qa/questions/:question_id/report", reportQuestion)

//PUT answer helpful
app.put("/qa/answers/:answer_id/helpful", markAnswerHelpful)

//PUT answer report
app.put("/qa/answers/:answer_id/report", reportAnswer)

app.listen(port, () => {
  console.log(`listening on port`, port);
})