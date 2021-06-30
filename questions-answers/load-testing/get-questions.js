import http from 'k6/http';
import {sleep} from 'k6';
export let options= {
  vus: 125,
  duration: '30s',
};
var max = 1000011; //product ids
export default function () {
  var randomId = Math.floor(Math.random() * max);
  var url1 = `http://localhost:3000/qa/questions?product_id=${randomId}&page=1&count=5`;
  // var url2 = `http://localhost:3000/qa/questions?product_id=${Math.floor(max/2)}&page=1&count=5`;
  // var url3 = `http://localhost:3000/qa/questions?product_id=${max-10}&page=1&count=5`;


  var payload = JSON.stringify({
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.get(url1, payload, params);
  sleep(0.1);
  // http.get(url2, payload, params);
  // http.get(url3, payload, params);
}