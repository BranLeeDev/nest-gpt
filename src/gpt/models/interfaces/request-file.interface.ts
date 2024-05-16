import type { MultipartFile, MultipartValue } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';

export interface RequestFile extends FastifyRequest {
  body: {
    file?: MultipartFile;
    prompt?: MultipartValue<string>;
  };
}
