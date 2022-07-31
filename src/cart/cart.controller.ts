import { cartDto } from './../dto/cartdto';
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  import { CartService } from './cart.service';
  
  @Controller('cart')
  export class CartController {
    constructor(private readonly CartService: CartService) {}
  
    // @Post()
    // async addProduct(
    //   @Body('id') prodID: number,
    //   @Body('subs_type') prodST: string,
    //   @Body('hits_count') prodHC: number,
    //   @Body('days_count') prodDC: number,
    //   @Body('price') prodPrice: number,
    // ) {
    //   const generatedId = await this.CartService.insertProduct(
    //     prodID, prodST, prodHC, prodDC, prodPrice
    //   );
    //   return { id: generatedId.id };
    // }

    @Post()
    async create(@Body() cartDto: cartDto) {
      return await this.CartService.insertProduct(cartDto);
    }
  
    @Get()
    async getAllProducts() {
      const products = await this.CartService.getProducts();
      return products;
    }
  
    // @Get(':id')
    // getProduct(@Param('id') prodId: String) {
    //   return this.CartService.getSingleProduct(prodId);
    //   // return prodId;
    // }

    @Get(':id')
    getWidget(@Param('id') prodId: String) {
      return this.CartService.getSingleWidget(prodId);
    }
  
    // @Patch(':id')
    // async updateProduct(
    //   @Param('id') prodId: Number,
    //   @Body('title') prodTitle: string,
    //   @Body('description') prodDesc: string,
    //   @Body('price') prodPrice: number,
    // ) {
    //   await this.CartService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
    //   return null;
    // }
  
    @Delete(':id')
    async removeProduct(@Param('id') prodId: String) {
        await this.CartService.deleteProduct(prodId);
        return null;
    }
  }