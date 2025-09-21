/**
 * Contact 메시지 목록 조회 API
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const contactFile = path.join(process.cwd(), 'content', 'data', 'contact-messages.json');

function loadJson<T>(file: string, defaultValue: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return defaultValue;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const messages = loadJson(contactFile, []);
    
    // 최신순으로 정렬
    const sortedMessages = messages.sort((a: any, b: any) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return res.status(200).json({
      success: true,
      messages: sortedMessages,
      total: sortedMessages.length
    });

  } catch (error: any) {
    console.error('Contact list error:', error);
    return res.status(500).json({
      error: 'Failed to load contact messages',
      details: error?.message || 'Unknown error'
    });
  }
}
