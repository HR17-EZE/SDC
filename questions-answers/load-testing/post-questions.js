import http from 'k6/http';

export let options= {
  vus: 200,
  duration: '30s',
};
var max = 1000011;
export default function () {
  var url = 'http://127.0.0.1:3000/qa/questions';
  var payloadSmall = JSON.stringify(
    {
      "body": "test body2",
      "name": "test Name",
      "email": "fake@aol.com",
      "product_id": 10
   });
  var payloadMed = JSON.stringify( {
    "body": "test body2",
    "name": "test Name",
    "email": "fake@aol.com",
    "product_id": max/2
 });
  var payloadLarge = JSON.stringify(
    {
      "body": "test body2",
      "name": "test Name",
      "email": "fake@aol.com",
      "product_id": max - 10
   }
  );
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.post(url, payloadSmall, params);
  http.post(url, payloadMed, params);
  http.post(url, payloadLarge, params);
}