import { userDto } from './../dto/userdto';
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  import { UserService } from './users.service';
  
  @Controller('user')
  export class UsersController {
    constructor(private readonly UserService: UserService) {}

    @Get('')
    async getAllProducts() {
      const products = await this.UserService.getProducts();
      return products;
    }

    @Get(':username')
    getUser(@Param('username') username: String) {
      return this.UserService.getOneUser(username);
    }

    @Post()
    async create(@Body() userDto: userDto) {
      return await this.UserService.insertUser(userDto);
    }

    @Post('login')
    async newValidate(@Body() userDto: userDto) {
      return await this.UserService.validateUser(userDto);
    }

    @Post('check')
    async newValidated(@Body() username: userDto) {
      return await this.UserService.getOneUser(username.username);
    }

    @Post('findbytoken')
    async getValidate(@Body('token') token: string) {
      return await this.UserService.findbytoken(token);
    }

    @Patch('addtocart')
    async AddWidgetToCart(
      @Body('details') details: object,
      @Body('widget') widget: object,
      @Body('username') username: string,
    ) {
      return this.UserService.AddWidgetToCart(details, widget, username);
    }

    @Patch('deletefromcart')
    async DeleteWidgetFromCart(
      @Body('widgetId') widgetId: Number,
      @Body('username') username: string,
    ) {
      return this.UserService.DeleteWidgetFromCart(widgetId, username);
    }

    @Patch('editcartwidget')
    async EditCartWidget(
      @Body('detailObj') detailObj: object,
      @Body('username') username: string,
    ) {
      return this.UserService.EditCartWidget(detailObj, username);
    }
  
    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        await this.UserService.deleteProduct(prodId);
        return null;
    }
  }