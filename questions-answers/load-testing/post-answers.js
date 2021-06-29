import http from 'k6/http';

export let options= {
  vus: 1,
  duration: '3s',
};
var max = 3523507;
export default function () {
  var url1 = `http://localhost:3000/qa/questions/${max}/answers?`;
  var url2 = `http://localhost:3000/qa/questions/${Math.floor(max/2)}/answers?`;
  var url3 = `http://localhost:3000/qa/questions/${max-10}/answers?`;
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
  http.post(url1, payload, params);
  http.post(url2, payload, params);
  http.post(url3, payload, params);
}