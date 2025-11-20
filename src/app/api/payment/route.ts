import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import mime from 'mime';

const paymentFilePath = process.env.PAYMENT_FOLDER as string;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file');
  const downloadCheck = searchParams.get('download') === 'true';
  if (!file) {
    return new NextResponse('Missing file', { status: 400 });
  }

  const filePath = path.join(process.cwd(), paymentFilePath, file);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const mimeType = mime.getType(filePath) || 'application/octet-stream';

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': downloadCheck ? `attachment; filename="${file}"` : 'inline',
      },
    });
  } catch {
    return new NextResponse('File not found', { status: 404 });
  }
}