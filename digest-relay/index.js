import express from 'express';
import bodyParser from 'body-parser';
import DigestFetch from 'digest-fetch';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const requestQueue = [];
let isProcessing = false;

app.post('/relay', (req, res) => {
  const { ip, path, username, password, query } = req.body;

  if (!ip || !path || !username || !password) {
    console.warn('[WARN] Missing required fields in request body');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isCancelCommand = query?.toLowerCase().includes('cancel=oncommand');

  if (isCancelCommand) {
    console.log(`[CANCEL] Detected cancel command, executing immediately.`);
    handleCancelCommand({ res, ip, path, username, password, query });
    return;
  }

  // Add to queue
  requestQueue.push({ req, res, ip, path, username, password, query });
  console.log(`[QUEUE] Job added. Queue length: ${requestQueue.length}`);

  if (!isProcessing) processQueue();
});

async function handleCancelCommand({ res, ip, path, username, password, query }) {
  const url = query ? `http://${ip}/${path}?${query}` : `http://${ip}/${path}`;
  const client = new DigestFetch(username, password);

  try {
    const response = await client.fetch(url, { method: 'GET' });

    const contentType = response.headers.get('content-type');
    const body = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    console.log(`[CANCEL-SUCCESS] ${url} → Status ${response.status}`);
    res.status(response.status).send(body);
  } catch (error) {
    console.error(`[CANCEL-ERROR] ${url} → ${error.message}`);
    res.status(500).json({ error: 'Cancel command failed', details: error.message });
  }
}

async function processQueue() {
  if (requestQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;

  const job = requestQueue.shift();
  const { res, ip, path, username, password, query } = job;

  const url = query ? `http://${ip}/${path}?${query}` : `http://${ip}/${path}`;
  const client = new DigestFetch(username, password);

  console.log(`[PROCESSING] ${url}`);

  try {
    const response = await client.fetch(url, { method: 'GET' });

    const contentType = response.headers.get('content-type');
    const body = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    console.log(`[SUCCESS] ${url} → Status ${response.status}`);
    res.status(response.status).send(body);
  } catch (error) {
    console.error(`[ERROR] ${url} → ${error.message}`);
    res.status(500).json({ error: 'Relay failed', details: error.message });
  } finally {
    processQueue(); // Next in queue
  }
}

app.listen(port, () => {
  console.log(`✅ Digest relay server running at http://localhost:${port}`);
});
