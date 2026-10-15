// Приёмник файлов для client/bake.ts: пишет присланные атласы в client/public/models/factions/. Только 127.0.0.1, только пути атласов.
import { createServer } from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
const dest = 'client/public/models/factions';
createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', '*'); res.setHeader('Access-Control-Allow-Private-Network', 'true'); // страница с localhost:5173
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const path = new URL(req.url ?? '', 'http://x').searchParams.get('path') ?? '';
  if (req.method !== 'POST' || !/^[a-z]+\/[a-z]+\/sprites\/[a-z_]+\.(webp|json)$/.test(path)) { res.writeHead(400); return res.end('bad path'); }
  const chunks = []; for await (const c of req) chunks.push(c);
  await mkdir(dirname(join(dest, path)), { recursive: true }); await writeFile(join(dest, path), Buffer.concat(chunks));
  res.writeHead(200); res.end('ok');
}).listen(4174, '127.0.0.1', () => console.log('bake-server: 127.0.0.1:4174'));
