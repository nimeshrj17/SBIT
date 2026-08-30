import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/productService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing product ID', { status: 400 });
  }

  // NOTE: This will require a server-side Firebase fetch function
  // We'll implement getProductServerSide in lib/productServiceServer.ts
  try {
    const product = await getProduct(id);
    if (!product || !product.image) {
      return new NextResponse('Product image not found', { status: 404 });
    }

    const image = product.image;
    
    // Check if it's a base64 string
    if (image.startsWith('data:image/')) {
      const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!match) {
        return new NextResponse('Invalid image format', { status: 500 });
      }
      
      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }
    
    // If it's a URL (like mock products), redirect to it
    return NextResponse.redirect(new URL(image, request.url));
    
  } catch (error) {
    console.error('Error fetching product image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
