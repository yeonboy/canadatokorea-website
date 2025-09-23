import fs from 'fs';
import path from 'path';

// Optional S3-backed JSON storage for Amplify/Serverless
// If CONTENT_S3_BUCKET is set, read/write JSON to that bucket; otherwise use local filesystem
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

function getEnv() {
  return {
    BUCKET: process.env.CONTENT_S3_BUCKET || '',
    REGION: process.env.CONTENT_REGION || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
    TODAY_KEY: process.env.CONTENT_TODAY_KEY || 'content/data/today-cards.json'
  } as const;
}

let s3Cache: { region: string; client: S3Client } | null = null;
function getS3(region: string): S3Client {
  if (!s3Cache || s3Cache.region !== region) {
    s3Cache = { region, client: new S3Client({ region }) };
  }
  return s3Cache.client;
}

export async function loadTodayJson<T>(def: T): Promise<T> {
  const { BUCKET, REGION, TODAY_KEY } = getEnv();
  if (BUCKET) {
    try {
      const out = await getS3(REGION).send(new GetObjectCommand({ Bucket: BUCKET, Key: TODAY_KEY }));
      const bodyStr = await readBodyToString(out.Body as any);
      if (bodyStr) return JSON.parse(bodyStr);
    } catch (e) {
      console.warn('S3 load failed, falling back to FS', {
        bucket: BUCKET,
        key: TODAY_KEY,
        region: REGION,
        error: (e as any)?.name || 'Unknown'
      });
    }
    return def;
  }
  console.warn('S3 not configured. Using local FS storage.', { BUCKET, REGION, TODAY_KEY });
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return def; }
}

export async function saveTodayJson(data: any): Promise<void> {
  const { BUCKET, REGION, TODAY_KEY } = getEnv();
  const body = JSON.stringify(data, null, 2);
  if (BUCKET) {
    await getS3(REGION).send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: TODAY_KEY,
      Body: body,
      ContentType: 'application/json; charset=utf-8',
    }));
    return;
  }
  // Try local FS. If read-only, but BUCKET is available at runtime, fallback to S3.
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  const dir = path.dirname(file);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, body);
  } catch (err: any) {
    if ((err?.code === 'EROFS' || /read-only/i.test(String(err?.message))) && BUCKET) {
      console.warn('FS read-only detected. Falling back to S3.', { file, bucket: BUCKET, key: TODAY_KEY });
      await getS3(REGION).send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: TODAY_KEY,
        Body: body,
        ContentType: 'application/json; charset=utf-8',
      }));
      return;
    }
    throw err;
  }
}

async function readBodyToString(body: any): Promise<string> {
  if (!body) return '';
  // Browser/Edge runtimes may expose transformToString
  if (typeof body.transformToString === 'function') {
    return await body.transformToString();
  }
  // Node.js stream
  if (body instanceof Readable || typeof body.on === 'function') {
    const chunks: Buffer[] = [];
    return await new Promise<string>((resolve, reject) => {
      body.on('data', (chunk: any) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      body.on('error', reject);
      body.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }
  if (body instanceof Uint8Array) return Buffer.from(body).toString('utf8');
  if (typeof body === 'string') return body;
  try { return String(body); } catch { return ''; }
}


