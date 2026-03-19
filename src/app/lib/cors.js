// lib/cors.js
import Cors from 'cors';
import initMiddleware from './init-middleware';

// You can configure origins, methods, etc.
const cors = initMiddleware(
  Cors({
    origin: '*', // or specify an array of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

export default cors;
