import { Module } from '@nestjs/common';
import { TextController } from './controllers/text.controller';
import { TextService } from './services/text.service';
import { AudioController } from './controllers/audio.controller';
import { AudioService } from './services/audio.service';

@Module({
  controllers: [TextController, AudioController],
  providers: [TextService, AudioService],
})
export class GptModule {}
