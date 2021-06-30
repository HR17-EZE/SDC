
// CONSTRAINT fk_customer
// FOREIGN KEY(customer_id)
// REFERENCES customers(customer_id)
CREATE TABLE products (
  id SERIAL,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price INT,
  PRIMARY KEY (id)
);
\COPY products(id, name, slogan, description, category, default_price)
FROM '/Users/elizabethmendenhall/Desktop/AprilHR/sdc/SDC/questions-answers/product.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE questions (
  question_id SERIAL,
  product_id SERIAL,
  body TEXT,
  date_written BIGSERIAL,
  asker_name TEXT,
  asker_email TEXT,
  reported BOOLEAN,
  helpful INT,
  PRIMARY KEY (question_id),
  CONSTRAINT fk_product
  FOREIGN KEY(product_id)
  REFERENCES products(id)
);

\COPY questions(question_id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/elizabethmendenhall/Desktop/AprilHR/sdc/SDC/questions-answers/questions.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE answers (
  answer_id SERIAL,
  question_id SERIAL,
  body TEXT,
  date_written BIGSERIAL,
  answerer_name TEXT,
  answerer_email TEXT,
  reported BOOLEAN,
  helpful INT,
  PRIMARY KEY (answer_id),
  CONSTRAINT fk_question
  FOREIGN KEY(question_id)
  REFERENCES questions(question_id)
);

\COPY answers(answer_id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful)
FROM '/Users/elizabethmendenhall/Desktop/AprilHR/sdc/SDC/questions-answers/answers.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE answer_photos (
  answer_photos_id SERIAL,
  answer_id SERIAL,
  url TEXT,
  PRIMARY KEY (answer_photos_id),
  CONSTRAINT fk_question
  FOREIGN KEY(answer_id)
  REFERENCES answers(answer_id)
);
\COPY answer_photos(answer_photos_id, answer_id, url)
FROM '/Users/elizabethmendenhall/Desktop/AprilHR/sdc/SDC/questions-answers/answers_photos.csv'
DELIMITER ','
CSV HEADER;
CREATE INDEX answer_id ON answer_photos(answer_id);
CREATE INDEX question_id ON answers(question_id);
CREATE INDEX product_id ON questions(product_id);

CREATE INDEX helpful ON answers(helpful);
CREATE INDEX reported ON answers(reported);

CREATE INDEX helpfulq ON questions(helpful);
CREATE INDEX reportedq ON questions(reported);
json_build_object

select json_build_object(
  'placeholder', (select json_agg(row_to_json(t)) from (select body, reported from questions where product_id = 10) t)
);

select row_to_json(t) from (select body, reported from questions where product_id = 10) t;
select json_object_keys(row_to_json(t)) from (select question_id from questions where product_id = 10) t;
select array_to_json(array_agg(row_to_json(t))) from (select body, reported from questions where product_id = 10) t;
[{"body":"HI GUYS?","reported":true},{"body":"Where is this product made?","reported":false},{"body":"What fabric is the top made of?","reported":false}]
(1 row)


//GET questions
select question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness, reported,
(
 select array_to_json(array_agg(row_to_json(d)))
  from (
    select row_to_json(a)
    from (

    select answer_id as id, body, date_written as date, answerer_name, helpful as helpfulness,
   coalesce(
    (
      select row_to_json(p)
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
    ) a
  ) d
) as answers
from questions
where product_id = 10;





//GET answers
SELECT answer_id, body, date_written as date, answerer_name, helpful as helpfulness,
coalesce(
  (
    select row_to_json(p)
    from (
      SELECT answer_photos_id as id, url
      FROM answer_photos
      INNER JOIN answers
      ON (answer_photos.answer_id = answers.answer_id) where answers.question_id = questions.question_id
    ) p
  ),
  '[]'
  ) as photos
FROM answers
WHERE answers.question_id = $1

SELECT body, helpful, reported
FROM questions
WHERE question_id = 10;


UPDATE questions
SET helpful = helpful + 1
WHERE question_id = 10;

SELECT body, helpful, reported
FROM answers
WHERE answer_id = 10;

//const {body, name, email, product_id} = req.body;
INSERT INTO questions(question_id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
VALUES ((select max(question_id) + 1
   from questions),
   $1, $2, $3, $4, $5, false, 0
);


SELECT body, helpful, reported
FROM questions
WHERE product_id = 10;

SELECT currval(pg_get_serial_sequence('questions', 'question_id'));
ALTER TABLE answers ALTER COLUMN answer_id SET DEFAULT nextval('answers_answer_id_seq'::regclass);
ALTER TABLE answer_photos ALTER COLUMN answer_photo_id SET DEFAULT nextval('answer_photos_answer_id_seq'::regclass);
//tried so far
ALTER TABLE questions ALTER question_id SET DEFAULT nextval('questions_question_id_seq');
ALTER TABLE questions ALTER question_id SET DEFAULT nextval('questions_question_id_seq'::regclass);
alter sequence 'questions_question_id_seq' start with (select max(question_id) + 1 from questions); //syntax error
alter sequence questions_question_id_seq start with (select max(question_id) + 1 from questions); //syntax error
SELECT setval(questions_question_id_seq, 3518967); //ERROR:  column "questions_question_id_seq" does not exist
SELECT setval(question_id, 3518967) from questions; //ERROR:  could not open relation with OID 1
//other
SELECT MAX(question_id) FROM questions;
SELECT setval('questions_question_id_seq', 3518967); //this works!!

//answers
SELECT MAX(answer_id) FROM answers;
SELECT setval('answers_answer_id_seq', 6879315); //this works!!
//answer photos
;
SELECT MAX(answer_photos_id) + 1 FROM answer_photos; //good
SELECT setval('answer_photos_answer_photos_id_seq', 206377); //
SELECT setval('answer_photos_answer_photos_id_seq', (SELECT MAX(answer_photos_id) + 1 FROM answer_photos) ); //didn't seem to work


//view all sequences
SELECT
    relname sequence_name
FROM
    pg_class
WHERE
    relkind = 'S';

//
explain analyze UPDATE answers
SET reported = true
WHERE answer_id = 10;

explain analyze UPDATE questions
SET reported = true
WHERE question_id = 10;

explain analyze UPDATE answers
SET reported = true
WHERE answer_id = 10;


