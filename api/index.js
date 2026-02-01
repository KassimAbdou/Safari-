import app from '../server.js';
import { createServer } from 'http';
import { parse } from 'url';

const server = createServer(app);

export default async function handler(req, res) {
  const parsedUrl = parse(req.url, true);

  await new Promise((resolve) => {
    server.emit('request', req, res, parsedUrl);
    res.on('finish', resolve);
  });
}
