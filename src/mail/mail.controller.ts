import { MailService } from './mail.service';
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  
  @Controller('mail')
  export class MailsController {
    constructor(private readonly MailService: MailService) {}

    @Post('sendmail')
    async sendmail(
      @Body('context') context: object
    ) {
      return await this.MailService.customMail(context);
    }

  }