import app from '../server.js';
import { createServer } from 'http';
import { parse } from 'url';

const server = createServer(app);

export default async function handler(req, res) {
  const parsedUrl = parse(req.url, true);

  // On fait passer la requête au serveur Express
  await new Promise((resolve) => {
    server.emit('request', req, res);
    res.on('finish', resolve);
  });
}
