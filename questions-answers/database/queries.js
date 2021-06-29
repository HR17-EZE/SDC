const Pool = require('pg').Pool;
const config = require('./database.config.js');
const format = require('pg-format');
const {user, host, database, password} = config;
const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: 5432
});
pool.on('error', (err, client) => {
  console.error("Unexpected error on the idle client", err);
  process.exit(-1);
});

module.exports = {
  //TODO format date
  //TODO answers should be object
  //TODO fix error: more than one row returned by a subquery used as an expression error when
  //when product id 5 is used

  //run where product id =
  //json agg
  getQuestions: (req, res) => {
  const {product_id, page, count} = req.query;
  const minIndex = (page - 1) * (count - 1);
  const maxIndex = page * count + 1;
  let response = {
    product_id: product_id,
    results: null
  };
  (async () => {
    const client = await pool.connect();
    const psql = `
    select question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness, reported,
    (
      select array_to_json(array_agg(row_to_json(d)))
      from (
        select answer_id as id, body, date_written as date, answerer_name, helpful as helpfulness,
       coalesce(
        (
          select array_to_json(array_agg(row_to_json(p)))
          from (
            SELECT answer_photos_id as id, url
            FROM answer_photos
            INNER JOIN answers
            ON (answer_photos.answer_id = answers.answer_id) where answers.question_id = questions.question_id
          ) p
        ),
        '[]'
        ) as photos
        from answers
        where question_id = questions.question_id
      ) d
    ) as answers
  from questions
  where product_id = $1
     `;

    try {
      const queryResponse = await client.query(psql, [product_id]);
      const questionArr = queryResponse.rows.map((questionObj) => {
         var answerObj = {};
         if (questionObj.answers) {
           questionObj.answers.map((answer) => {
             answerObj[answer.id] = answer;
           })
         }
         questionObj.answers = answerObj;
         return questionObj;
      })
      response.results = questionArr; // queryResponse.rows;
    }
    finally {
      client.release();
      res.send(response);
    }
  })().catch((err) => {
    console.log(err.stack);
    res.sendStatus(500);
  });
  },
  getAnswers: (req, res) => {
    const {page, count} = req.query;
    const {question_id} = req.params;
    let response = {
      question: question_id,
      page: page,
      count: count,
      results: null
    };
    (async () => {
      const client = await pool.connect();
      const minIndex = (page - 1) * (count - 1);
      const maxIndex = page * count + 1;
      const psql = `
SELECT answer_id, body, date_written as date, answerer_name, helpful as helpfulness,
coalesce(
  (
    select array_to_json(array_agg(row_to_json(p)))
    from (
      SELECT answer_photos_id as id, url
      FROM answer_photos
      WHERE answer_photos_id = answers.answer_id
    ) p
  ),
  '[]'
  ) as photos
FROM answers
WHERE answers.question_id = $1
      `;
      try {
        var result = await client.query(psql, [question_id]);
        response.results = result.rows.slice(minIndex, maxIndex);
        response.results = response.results.map((answerObj) => {
            answerObj.date = new Date(Number(answerObj.date));
            return answerObj;
          })
      }
      finally {
        client.release()
        res.send(response);
      }
    })().catch((err) => {
      console.log(err.stack);
      res.sendStatus(500)
    });
  },
  postQuestion: (req, res) => {
    //console.log('getting req', req.query, req.body, req.params);
    const {body, name, email, product_id} = req.body;
    (async () => {
      const client = await pool.connect();
      const psql = `
      INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful)
VALUES ($1, $2, $3, $4, $5, false, 0);
      `;
      try {
       // var date = Date.now/1000 | 0;
        var result = await client.query(psql, [product_id, body, Date.now(), name, email]);
      }
      finally {
        client.release()
        res.sendStatus(201);
      }
    })().catch((err) => {
      console.log(err.stack);
      res.sendStatus(500)
    });
  },
  postAnswer: (req, res) => {
    const {body, name, email, photos} = req.body;
    const {question_id} = req.params;
    console.log('id', question_id);
    (async () => {
      const client = await pool.connect();
      try {
         const psql =
         `INSERT INTO answers
         (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
          VALUES ($1, $2, $3, $4, $5, false, 0) returning answer_id`;
        var answerInsertReponse = await client.query(psql, [question_id, body, Date.now(), name, email]);
         var answerId = answerInsertReponse.rows[0]['answer_id'];
         //insert photos
         var photoInsertions = photos.map((url, index) => {
           return [answerId, url];
         })
         let photoQuery = format("INSERT INTO answer_photos (answer_id, url) VALUES %L", photoInsertions);
        var insertPhotoPromise = await client.query(photoQuery);
      }
      finally {
        client.release()
        res.sendStatus(201);
      }
    })().catch((err) => {
      console.log(err.stack);
      res.sendStatus(500)
  });
  },
  markQuestionHelpful: (req, res) => {
    const {question_id} = req.params;
    (async () => {
      const client = await pool.connect();
      const psql = `
      UPDATE questions
SET helpful = helpful + 1
WHERE question_id = $1;
      `;
      try {
        var result = await client.query(psql, [question_id]);
      }
      finally {
        client.release()
        res.sendStatus(204);
      }
    })().catch((err) => {
      console.log(err.stack);
      res.sendStatus(500)
    });
  },
  markAnswerHelpful: (req, res) => {
    const {answer_id} = req.params;
    (async () => {
      const client = await pool.connect();
      const psql = `
      UPDATE answers
SET helpful = helpful + 1
WHERE answer_id = $1;
      `;
      try {
        var result = await client.query(psql, [answer_id]);
      }
      finally {
        client.release()
        res.send(204);
      }
    })().catch((err) => {
      console.log(err.stack);
      res.sendStatus(500)
    });
  },
  reportQuestion: (req, res) => {
    const {question_id} = req.params;
    console.log('param', question_id)
    (async () => {
      const client = await pool.connect();
      const psql = `
      UPDATE questions
SET reported = true
WHERE question_id = $1;
      `;
      try {
        var result = await client.query(psql, [question_id]);
      }
      finally {
        client.release()
        res.send(204);
      }
    })().catch((err) => {
      console.log(err.stack);
      res.sendStatus(500)
    });
  },
  reportAnswer: (req, res) => {
    const {answer_id} = req.params;
    (async () => {
      const client = await pool.connect();
      const psql = `
      UPDATE answers
SET reported = true
WHERE answer_id = $1;
      `;
      try {
        var result = await client.query(psql, [answer_id]);
      }
      finally {
        client.release()
        res.sendStatus(204);
      }
    })().catch((err) => {
      console.log(err.stack);
      res.sendStatus(500)
    });
  },
}
//index product id or anythin we want fast access to
//compound key



      //brew install k6
