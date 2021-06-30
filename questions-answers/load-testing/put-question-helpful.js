import http from 'k6/http';
import {sleep} from 'k6';

export let options= {
  vus: 170,
  duration: '30s',
};
var max = 3523507;
export default function () {
  var randomId = Math.floor(Math.random() * max);
  var url = `http://localhost:3000/qa/questions/${randomId}/helpful`;
  var payload = JSON.stringify({
  });
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.put(url, payload, params);
  sleep(0.1);
}