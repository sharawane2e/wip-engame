import { cartDto } from './../dto/cartdto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from './cart.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
  ) {}

  // async insertProduct(prodID: number, prodST: string, prodHC: number, prodDC: number, prodPrice: number): Promise<Cart> {
  //   const newProduct = new this.cartModel({
  //     prodID, prodST, prodHC, prodDC, prodPrice
  //   });
  //   const result = await newProduct.save();
  //   return result;
  // }

  async insertProduct(cartDto : cartDto): Promise<Cart> {
    // let ab = {
    //   prodID, prodST, prodHC, prodDC, prodPrice
    // }
    return await new this.cartModel({...cartDto, createdAt: new Date()}).save();
    // const result = await newProduct.save();
    // return result;
  }

  async getProducts() {
    const products = await this.cartModel.find().exec();
    return products.map(prod => ({
      id: prod.id,
      subs_type: prod.subs_type,
      hits_count: prod.hits_count,
      days_count: prod.days_count,
      price: prod.price
    }));
  }

  async getSingleProduct(productId: String) {
    const product = await this.findProduct(productId);
    return {
        id: product.id,
        subs_type: product.subs_type,
        hits_count: product.hits_count,
        days_count: product.days_count,
        price: product.price
    };
  }

  async getSingleWidget(pid: String){
    const widget = await this.cartModel.findOne({ id: pid }).exec();
    return widget;
  }

  async updateProduct(
    productId: String,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    // if (title) {
    //   updatedProduct.title = title;
    // }
    // if (desc) {
    //   updatedProduct.description = desc;
    // }
    // if (price) {
    //   updatedProduct.price = price;
    // }
    updatedProduct.save();
  }

  async deleteProduct(prodId: String) {
    const result = await this.cartModel.deleteOne({id: prodId}).exec();
    if (!result) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findProduct(id: String): Promise<Cart> {
    let product;
    try {
      product = await this.cartModel.findById(id).exec();
      debugger;
    } 
    catch (error) {
      throw new NotFoundException('Could not find product ABCDEF.');
      debugger;
    }
    if (!product) {
      throw new NotFoundException('Could not find product EFGH.');
    }
    return product;
  }
}