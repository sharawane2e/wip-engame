import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  import { ProductsService } from './products.service';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Post()
    async addProduct(
      @Body('title') prodTitle: string,
      @Body('description') prodDesc: string,
      @Body('price') prodPrice: number,
    ) {
      const generatedId = await this.productsService.insertProduct(
        prodTitle,
        prodDesc,
        prodPrice,
      );
      return { id: generatedId };
    }
  
    @Get()
    async getAllProducts() {
      const products = await this.productsService.getProducts();
      return products;
    }

    @Post('subscription/validate')
    async getValidate(@Body('clientkey') clientkey: object) {
      return await this.productsService.getValidatedData(clientkey);
    }

    @Post('subscription/hitcount')
    async gethitcount(@Body('clientkey') clientkey: object) {
      return await this.productsService.hitcount(clientkey);
    }
  
    // @Get(':id')
    // getProduct(@Param('id') prodId: string) {
    //   return this.productsService.getSingleProduct(prodId);
    // }

    @Get(':id')
    getWidget(@Param('id') prodId: String) {
      return this.productsService.getSingleWidget(prodId);
    }
  
    @Patch(':id')
    async updateProduct(
      @Param('id') prodId: string,
      @Body('title') prodTitle: string,
      @Body('description') prodDesc: string,
      @Body('price') prodPrice: number,
    ) {
      await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
      return null;
    }
  
    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        await this.productsService.deleteProduct(prodId);
        return null;
    }
  }