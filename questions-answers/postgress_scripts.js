\COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/elizabethmendenhall/Desktop/AprilHR/sdc/SDC/questions-answers/questions.csv'
DELIMITER ','
CSV HEADER;

alter table questions drop column body;
alter table questions add column body text;

alter table questions drop column asker_name;
alter table questions add column asker_name text;

alter table questions drop column asker_email;
alter table questions add column asker_email text;
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