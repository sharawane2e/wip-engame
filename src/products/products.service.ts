import { UserService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { decrypt } from 'src/Utils/EncryptFunctions';

import { Product } from './products.model';
import { User } from 'src/users/users.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly UserModel: Model<User>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const result = await newProduct.save();
    return result.id as Number;
  }

  async getProducts() {
    const products = await this.productModel.find().exec();
    return products.map(prod => ({
      id: prod.id,
      widget_type_id: prod.widget_type_id,
      widget_type: prod.widget_type,
      name: prod.name,
      title: prod.title,
      widget_embed_code: prod.widget_embed_code,
      is_purchased: prod.is_purchased,
      toolname: prod.toolname,
      toolLink: prod.toolLink,
      summary: prod.summary,
      imgUrl: prod.imgUrl,
      hitcount: prod.hitcount,
      howtowork: prod.howtowork
    }));
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
        id: product.id,
        widget_type_id: product.widget_type_id,
        widget_type: product.widget_type,
        name: product.name,
        title: product.title,
        widget_embed_code: product.widget_embed_code,
        is_purchased: product.is_purchased,
        toolname: product.toolname,
        toolLink: product.toolLink,
        summary: product.summary,
        imgUrl: product.imgUrl,
        hitcount: product.hitcount,
        howtowork: product.howtowork
    };
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    // if (desc) {
    //   updatedProduct.description = desc;
    // }
    // if (price) {
    //   updatedProduct.price = price;
    // }
    updatedProduct.save();
  }

  async getSingleWidget(pid: String){
    const widget = await this.productModel.findOne({ id: pid }).exec();
    return widget;
  }

  async getValidatedData(key:any){

    let decryptedStr = decrypt("saltise2eresearch", key);
    let strSplit = decryptedStr.split("*");
    let accessToken = strSplit[0];
    let widgetId = strSplit[1];
    let plan_type = strSplit[2];
    let ispaused = strSplit[3];

    let widgetObj:any;
    this.getSingleWidget(widgetId).then(x => widgetObj = x);

    // let userObj:any = UserService.findbytoken(accessToken);
    let userObj:any = await this.UserModel.findOne({ accessToken : accessToken }).exec();

    if(!userObj || !accessToken || !widgetId || !plan_type || !widgetObj){

      let ExceptionSample = {
        "data": [
          {
            "responseText": "You dont have access.",
            "HasSuccess": true
          }
        ],
        "status": true,
        "status_code": 404,
      }

      return ExceptionSample;
    }
    else{
      let SuccessSample = {
        "data": [
            {
                "widget_name": widgetObj.title,
                "plan_type": plan_type,
                "is_secrate_key_active": true,
                "is_widget_purchase": true,
                "is_widget_active": !ispaused,
                "is_paused": false,
                "responseText": "You have access to run this tool ! Thanks for choosing E2E Research",
                "HasSuccess": true,
                "username" : userObj.username
            }
        ],
        "status": true,
        "status_code": 200,
        "detail": {
            "message": "ok.",
            "code": "valid"
        }
      }

      return SuccessSample;
    }

  }

  isValidJson(str:any) {
    try {
        JSON.parse(JSON.stringify(str));
    } 
    catch (e) {
        return false;
    }
    return true;
  }

  async hitcount(key:any){
    let decryptedStr = decrypt("saltise2eresearch", key);
    let strSplit = decryptedStr.split("*");
    let accessToken = strSplit[0];
    let widgetId = strSplit[1];
    let plan_type = strSplit[2];
    let ispaused = strSplit[3];

    let widgetObj:any;
    const a = await this.getSingleWidget(widgetId).then(x => widgetObj = x);

    let userObj:any = await this.UserModel.findOne({ accessToken : accessToken }).exec();

    if(this.isValidJson(userObj) && this.isValidJson(widgetObj)){

      let UserClone:any = JSON.parse(JSON.stringify(userObj));
      let widClone:any = JSON.parse(JSON.stringify(widgetObj));  
      let widIndex = UserClone.purchasedwidgets.findIndex((x:any) => x.details.id == Number(widgetId));
      let widgetHC = UserClone.purchasedwidgets[widIndex].widget.hitcount;
      UserClone.purchasedwidgets[widIndex].widget.hitcount = widgetHC + 1;

      const result = await userObj.update({
        $set: {
          firstname: UserClone.firstname,
          lastname: UserClone.lastname,
          username: UserClone.username,
          password: UserClone.password,
          accessToken: UserClone.accessToken,
          purchasedwidgets: UserClone.purchasedwidgets,
          cartwidgets: UserClone.cartwidgets
        }
      })
    }



    if(!userObj || !accessToken || !widgetId || !plan_type || !widgetObj){

      let ExceptionSample = {
        "data": [
          {
            "responseText": "You dont have access.",
            "HasSuccess": true
          }
        ],
        "status": true,
        "status_code": 404,
      }

      return ExceptionSample;
    }
    else{
      let SuccessSample = {
        "data": [
            {
                "responseText": "You have access to run this tool ! Thanks for choosing E2E Research",
                "HasSuccess": true
            }
        ],
        "status": true,
        "status_code": 200,
        "detail": {
            "message": "ok.",
            "code": "valid"
        }
    }

      return SuccessSample;
    }
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({_id: prodId}).exec();
    if (!result) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.find({ id: Number(id) }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}


// function findbytoken(accessToken: any): any {
//   throw new Error('Function not implemented.');
// }
// function findbytoken(accessToken: any): any {
//   throw new Error('Function not implemented.');
// }
