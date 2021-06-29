import http from 'k6/http';

export let options= {
  vus: 1000,
  duration: '30s',
};
var max = 1000011;
export default function () {
  var url1 = `http://localhost:3000/qa/questions/${10}/answers?page=1&count=5`;
  var url2 = `http://localhost:3000/qa/questions/${Math.floor(max/2)}/answers?page=1&count=5`;
  var url3 = `http://localhost:3000/qa/questions/${max - 10}/answers?page=1&count=5`;
  var payload = JSON.stringify({
    page: 1,
    count: 5
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.get(url1, payload, params);
  http.get(url2, payload, params);
  http.get(url3, payload, params);
}