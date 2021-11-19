# SDC

## Introduction
The System Design Capstone was an API  microservice for the Q&A section of the e-commerce service Pegasus StoreFront. 

## ETL Process
Data was importing from CSV file using Postgresql 'COPY' command.
```
COPY products(id, name, slogan, description, category, default_price)
FROM '*****/SDC/questions-answers/product.csv'
DELIMITER ','
CSV HEADER;
```

## Optimizing the Database
Indexes were created to increase query speed.
```
CREATE INDEX answer_id ON answer_photos(answer_id);
CREATE INDEX question_id ON answers(question_id);
CREATE INDEX product_id ON questions(product_id);
CREATE INDEX helpful ON answers(helpful);
CREATE INDEX reported ON answers(reported);
CREATE INDEX helpfulq ON questions(helpful);
CREATE INDEX reportedq ON questions(reported);
```

## Testing
Initial testing was done with Postman and K6
```
import http from 'k6/http';
import {sleep} from 'k6';
export let options= {
  vus: 125,
  duration: '30s',
};
var max = 1000011;
export default function () {
  var randomId = Math.floor(Math.random() * max);
  var url= `http://localhost:3000/qa/questions/${randomId}/answers?page=1&count=5`;
  var payload = JSON.stringify({
    page: 1,
    count: 5
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.get(url, payload, params);
  sleep(0.1);
}
```
## The Queries
This service uses Postgresql for its database. The more complex queries use Postgresql functions to shape the data. 
```
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
```

## Load Balancing
Loading balancing was done with two intances of the server using NginX.
## Testing After Deployment
Further testing was done with Loader.io
