import http from 'k6/http';
import {sleep} from 'k6';
export let options= {
  vus: 3000,
  duration: '30s',
};
var max = 3523507;
export default function () {
  var randomId = Math.floor(Math.random() * max);
  var url = `http://localhost:3000/qa/questions/${randomId}/answers?`;
  var payload = JSON.stringify(
    {
      "body": "Yes thats right",
      "name" : "Asker name",
      "email": "askeremail@oal.com",
      "photos": ["testurl", "testulr2"]
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.post(url, payload, params);
  sleep(0.1);
}