import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule as NestServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    NestServeStaticModule.forRoot({
      rootPath: join(__dirname, 'client'),
      serveRoot: '/',
    }),
  ],
})
export class ServeStaticModule {}
