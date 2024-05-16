import { Module } from '@nestjs/common';
import { TextController } from './controllers/text.controller';
import { TextService } from './services/text.service';
import { AudioController } from './controllers/audio.controller';
import { AudioService } from './services/audio.service';
import { ImageService } from './services/image.service';
import { ImageController } from './controllers/image.controller';

@Module({
  controllers: [TextController, AudioController, ImageController],
  providers: [TextService, AudioService, ImageService],
})
export class GptModule {}
