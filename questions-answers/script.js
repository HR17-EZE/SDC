import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 200,
  duration: '30s',
};
export default function () {
  http.get('localhost:3000/qa/questions');
  sleep(1);
}

//