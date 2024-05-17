import { Buffer } from 'node:buffer';
import { InternalServerErrorException } from '@nestjs/common';
import { saveFileToGenerated } from './files.util';

export async function downloadImage(url: string, imageType: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new InternalServerErrorException('Download image was not possible');
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await saveFileToGenerated(buffer, 'images', imageType);
}
