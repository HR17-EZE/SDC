import http from 'k6/http';
import {sleep} from 'k6';
export let options= {
  vus: 175,
  duration: '30s',
};
var max =  6879325;
export default function () {
  var randomId = Math.floor(Math.random() * max);
  var url = `http://localhost:3000/qa/answers/${randomId}/helpful`;
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