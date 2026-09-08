import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file || !path) {
      return NextResponse.json({ error: 'Missing file or path' }, { status: 400 });
    }

    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: 'Storage bucket not configured' }, { status: 500 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${path}/${Date.now()}_${file.name}`;
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodeURIComponent(fileName)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    // The download token is provided in the response data for unauthenticated uploads (if rules allow)
    // If not, alt=media still works if the bucket is public, or we can construct the standard URL.
    const downloadToken = data.downloadTokens ? `&token=${data.downloadTokens}` : '';
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(fileName)}?alt=media${downloadToken}`;
    
    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
