import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ImageGenerationDto,
  ImageMaskingDto,
  ImageVariationDto,
} from '../dtos';
import { OpenaiService } from '../../ai/services/openai.service';
import {
  convertToBase64,
  downloadBase64Image,
  downloadImage,
} from '@utils/images.util';
import { checkIfFileExists } from '@utils/files.util';
import config from '@configs/config.config';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    this.logger.log('Starting image generation process');
    const { prompt } = imageGenerationDto;
    const { serverUrl } = this.configService;
    try {
      this.logger.debug(`Prompt received: ${prompt}`);
      const response = await this.openaiService.openAi.images.generate({
        prompt,
        model: 'dall-e-3',
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url',
      });
      const imageUrl = response.data[0].url || '';
      this.logger.debug(`Image URL received: ${imageUrl}`);
      const { fileId } = await downloadImage(imageUrl, 'png');
      this.logger.log('Image generation process completed successfully');
      return {
        url: `${serverUrl}/image/image-generation/${fileId}`,
        openAiUrl: imageUrl,
        revisedPrompt: response.data[0].revised_prompt,
      };
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async imageVariation(imageVariationDto: ImageVariationDto) {
    const { baseImageUrl } = imageVariationDto;
    const { serverUrl } = this.configService;
    try {
      this.logger.log(
        `Starting image variation process for URL: ${baseImageUrl}`,
      );
      const { imageFilePath: firstImageFilePath } = await downloadImage(
        baseImageUrl,
        'png',
      );
      this.logger.debug(`Image downloaded to: ${firstImageFilePath}`);
      const response = await this.openaiService.openAi.images.createVariation({
        model: 'dall-e-2',
        image: createReadStream(firstImageFilePath),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });
      const generatedImageUrl = response.data[0].url || '';
      const { imageFilePath: secondImageFilePath, fileId } =
        await downloadImage(generatedImageUrl, 'png');
      this.logger.debug(
        `Generated image downloaded to: ${secondImageFilePath}`,
      );
      const result = {
        url: `${serverUrl}/image/image-generation/${fileId}`,
        openAiUrl: generatedImageUrl,
        revisedPrompt: response.data[0].revised_prompt,
      };
      this.logger.log('Image variation process completed successfully');
      return result;
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async imageGenerationGetter(fileId: string) {
    this.logger.log(`Starting to retrieve image file with ID ${fileId}`);
    try {
      const { filePath } = checkIfFileExists('images', fileId, 'png');
      this.logger.debug(`File path found: ${filePath}`);
      const data = await readFile(filePath);
      const buffer = Buffer.from(data);
      this.logger.log(`Successfully retrieved image file with ID ${fileId}`);
      return buffer;
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async imageMasking(imageMaskingDto: ImageMaskingDto) {
    const { prompt, originalImageUrl, maskImageBase64 } = imageMaskingDto;
    const { serverUrl } = this.configService;
    try {
      this.logger.log(`Processing image masking with prompt: ${prompt}`);
      const pngImage = await downloadImage(originalImageUrl, 'png');
      const base64Image = await downloadBase64Image(maskImageBase64, 'png');
      const response = await this.openaiService.openAi.images.edit({
        model: 'dall-e-2',
        prompt,
        image: createReadStream(pngImage.imageFilePath),
        mask: createReadStream(base64Image.filePath),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });
      const respUrl = response.data[0].url;
      if (!respUrl) {
        throw new NotFoundException('No URL found in response data');
      }
      const openaiImage = await downloadImage(respUrl, 'png');
      this.logger.log(`Image masking completed successfully`);
      return {
        url: `${serverUrl}/image/image-generation/${openaiImage.fileId}`,
        openAiUrl: respUrl,
        revisedPrompt: response.data[0].revised_prompt,
      };
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }

  async extractTextFromImage(filePath: string, prompt: string | undefined) {
    try {
      this.logger.log('Starting extraction of text from image');
      const base64Image = await convertToBase64(filePath);
      const response = await this.openaiService.openAi.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt ?? '¿Que logras ver en la imagen?',
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
      });
      this.logger.log('Text extraction successful');
      return {
        msg: response.choices[0].message.content,
      };
    } catch (error) {
      this.logger.error({
        message: error.message,
        error: error.type,
        statusCode: error.status,
      });
      throw new HttpException(error.message, error.status);
    }
  }
}
