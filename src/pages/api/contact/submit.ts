/**
 * Contact Us 폼 제출 처리 API
 * 사용자 메시지를 review 페이지에서 확인할 수 있도록 저장
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type ContactMessage = {
  id: string;
  type: 'feedback' | 'correction' | 'suggestion' | 'source' | 'other';
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  locale: string;
  status: 'new' | 'reviewed' | 'responded';
  reviewedAt?: string;
  response?: string;
};

const contactFile = path.join(process.cwd(), 'content', 'data', 'contact-messages.json');

function loadJson<T>(file: string, defaultValue: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function saveJson(file: string, data: any) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, type, submittedAt, locale } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, email, and message are required'
      });
    }

    // 기존 메시지 로드
    const existingMessages: ContactMessage[] = loadJson(contactFile, []);

    // 새 메시지 생성
    const newMessage: ContactMessage = {
      id: generateId(),
      type: type || 'feedback',
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || '',
      message: message.trim(),
      submittedAt: submittedAt || new Date().toISOString(),
      locale: locale || 'en',
      status: 'new'
    };

    // 메시지 추가 (최신순)
    const updatedMessages = [newMessage, ...existingMessages];

    // 파일 저장
    saveJson(contactFile, updatedMessages);

    console.log(`📧 새 연락 메시지: ${newMessage.type} from ${newMessage.name} (${newMessage.email})`);

    return res.status(200).json({
      success: true,
      message: 'Contact message submitted successfully',
      messageId: newMessage.id
    });

  } catch (error: any) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    });
  }
}
