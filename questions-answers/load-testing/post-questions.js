import http from 'k6/http';
import {sleep} from 'k6';
export let options= {
  vus: 140,
  duration: '30s',
};
var max = 1000011;
export default function () {
  var randomId = Math.floor(Math.random() * max);
  var url = 'http://127.0.0.1:3000/qa/questions';
  var payload= JSON.stringify(
    {
      "body": "test body2",
      "name": "test Name",
      "email": "fake@aol.com",
      "product_id": randomId
   });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.post(url, payload, params);
  sleep(0.1);
}