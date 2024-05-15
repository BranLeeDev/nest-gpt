import { HttpException, Injectable, Logger } from '@nestjs/common';
import { OrthographyDto } from '../dtos';
import { OpenaiService } from '../../ai/services/openai.service';

@Injectable()
export class TextService {
  private readonly logger = new Logger(TextService.name);

  constructor(private readonly openaiService: OpenaiService) {}

  async orthographyCheck(orthographyDto: OrthographyDto) {
    const { prompt, maxTokens } = orthographyDto;
    try {
      this.logger.log(`Initiating orthography check for prompt: ${prompt}`);
      const completion =
        await this.openaiService.openAi.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `
              Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
              Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
              Debes de responder en formato JSON,
              tu tarea es corregirlos y retornar información soluciones,
              también debes de dar un porcentaje de acierto por el usuario,

              Si no hay errores, debes de retornar un mensaje de felicitaciones.

              Ejemplo de salida:
              {
                userScore: number,
                errors: string[], // ['error -> solución']
                message: string, //  Usa emojis y texto para felicitar al usuario
              }
              `,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.3,
          max_tokens: maxTokens,
          response_format: {
            type: 'json_object',
          },
        });
      const jsonResp = JSON.parse(
        completion.choices[0].message.content ?? 'No hay contenido disponible',
      );
      this.logger.log(`JSON response: ${JSON.stringify(jsonResp)}`);
      return jsonResp;
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
