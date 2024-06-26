import { resolve, join, parse } from 'node:path';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';

export async function saveFileToGenerated(
  buffer: Buffer,
  folder: string,
  fileFormat: string,
) {
  const folderPath = resolve(__dirname, '..', '..', '..', 'generated', folder);
  const fileId = randomUUID();
  const filePath = join(folderPath, `${fileId}.${fileFormat}`);
  await mkdir(folderPath, { recursive: true });
  await writeFile(filePath, buffer);
  return {
    filePath,
    fileId,
  };
}

export function checkIfFileExists(
  folder: string,
  fileId: string,
  fileFormat: string,
) {
  const filePath = join(
    __dirname,
    '..',
    '..',
    '..',
    'generated',
    `${folder}`,
    `${fileId}.${fileFormat}`,
  );
  const wasFound = existsSync(filePath);
  if (!wasFound) {
    throw new NotFoundException(`File ${fileId}.${fileFormat} not found`);
  }

  return {
    filePath,
  };
}

export function getFilePath(url: string) {
  const parsedUrl = parse(url);
  const fileName = parsedUrl.name;
  if (isUUID(fileName)) {
    return {
      dir: parsedUrl.dir,
      name: parsedUrl.name,
    };
  }
}
