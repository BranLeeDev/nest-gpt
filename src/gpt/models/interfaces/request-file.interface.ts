import type {
  FastifyMultipartBaseOptions,
  MultipartFile,
} from '@fastify/multipart';
import { FastifyRequest } from 'fastify';

export interface RequestFile extends FastifyRequest {
  file?: (options?: FastifyMultipartBaseOptions) => Promise<MultipartFile>;
}
