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