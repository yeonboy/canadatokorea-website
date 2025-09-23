import fs from 'fs';
import path from 'path';

// Optional S3-backed JSON storage for Amplify/Serverless
// If CONTENT_S3_BUCKET is set, read/write JSON to that bucket; otherwise use local filesystem
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.CONTENT_S3_BUCKET || '';
// Prefer CONTENT_REGION; fallback to AWS defaults for local/dev
const REGION = process.env.CONTENT_REGION || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const TODAY_KEY = process.env.CONTENT_TODAY_KEY || 'content/data/today-cards.json';

let s3: S3Client | null = null;
function getS3(): S3Client {
  if (!s3) s3 = new S3Client({ region: REGION });
  return s3;
}

export async function loadTodayJson<T>(def: T): Promise<T> {
  if (BUCKET) {
    try {
      const out = await getS3().send(new GetObjectCommand({ Bucket: BUCKET, Key: TODAY_KEY }));
      const body = await out.Body?.transformToString();
      if (body) return JSON.parse(body);
    } catch (e) {
      // fall through to default
    }
    return def;
  }
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return def; }
}

export async function saveTodayJson(data: any): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (BUCKET) {
    await getS3().send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: TODAY_KEY,
      Body: body,
      ContentType: 'application/json; charset=utf-8',
    }));
    return;
  }
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, body);
}


