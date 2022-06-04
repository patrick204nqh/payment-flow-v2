import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    let message = exception.getResponse() as {
      key: string;
      args: Record<string, unknown>;
    };

    try {
      message = await this.i18n.translate(message.key, {
        lang: ctx.getRequest().i18nLang,
        args: message.args,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    response.status(statusCode).json({ statusCode, message });
  }
}
