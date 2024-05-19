import { Buffer } from 'node:buffer';
import { InternalServerErrorException } from '@nestjs/common';
import {
  checkIfFileExists,
  getFilePath,
  saveFileToGenerated,
} from './files.util';

export async function downloadImage(url: string, imageType: string) {
  const imageExists = getFilePath(url);
  if (imageExists) {
    const fileId = imageExists.name;
    const { filePath: imageFilePath } = checkIfFileExists(
      'images',
      fileId,
      'png',
    );
    return {
      imageFilePath,
      fileId,
    };
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new InternalServerErrorException('Download image was not possible');
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const { filePath: imageFilePath, fileId } = await saveFileToGenerated(
    buffer,
    'images',
    imageType,
  );
  return {
    imageFilePath,
    fileId,
  };
}
