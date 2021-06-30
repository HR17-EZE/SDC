select question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness, reported,
(
  select json_agg(d)
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
  ) d
) as answers
from questions
where product_id = $1