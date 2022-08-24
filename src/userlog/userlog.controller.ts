
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  import { UserlogsService } from './userlog.service';
  
  @Controller('userlog')
  export class UserlogsController {
    constructor(private readonly UserlogsService: UserlogsService) {}
  
    @Patch(':email')
    async addProduct(
      @Param('email') email: string,
      @Body('type') logType: string,
      @Body('time') logTime: string,
      @Body('area') logArea: string,
    ) {
      const generatedLog = await this.UserlogsService.insertLog(
        email, logType, logTime, logArea
      );
      return { id: generatedLog };
    }
  
    @Get('')
    async getAllLogs() {
      const products = await this.UserlogsService.getAllLogs();
      return products;
    }

  }