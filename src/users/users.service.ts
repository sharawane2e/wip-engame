import { userDto } from './../dto/userdto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './users.model';

@Injectable()
export class UserService {
  static findbytoken: any;
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async insertUser(userDto : userDto): Promise<User> {
    // const newProduct = new this.userModel({
    //   title,
    //   description: desc,
    //   price,
    // });
    // const result = await newProduct.save();
    // return result.id as Number;
    return await new this.userModel({...userDto, createdAt: new Date()}).save();

  }

  async validateUser(userDto : any) {
    const user = await this.getOneUser(userDto.username);
    let obj = {}
    if (!user) {
      // throw new NotFoundException('Could not find User.');
      obj['authenticated'] = false;
      obj['errorMsg'] = "No such user !";
    }
    else{
      if(userDto.password == user.password){
        obj['authenticated'] = true;
        obj['username'] = user.username;
      }
      else{
        obj['authenticated'] = false;
        obj['errorMsg'] = "Invalid Credentials !"
      }
    }
    return obj;
  }

  async getOneUser(username: String) {
    const user = await this.userModel.findOne({ username : username }).exec();
    return user;
  }

  async getProducts() {
    const users = await this.userModel.find().exec();
    return users.map(user => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      password: user.password,
      accessToken: user.accessToken,
      purchasedwidgets: user.purchasedwidgets,
      cartwidgets: user.cartwidgets
    }));
  }

  async getSingleProduct(userId: string) {
    const user = await this.findProduct(userId);
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      password: user.password,
      accessToken: user.accessToken,
      purchasedwidgets: user.purchasedwidgets,
      cartwidgets: user.cartwidgets
    };
  }

  async AddWidgetToCart(details:object, widget: object, username: string) {
    let userObj = await this.getOneUser(username);
    let widObj = {
      "details": details,
      "widget": widget
    }
    userObj.cartwidgets.push(widObj);
    userObj.save();

    return userObj;
  }

  async EditCartWidget(detailObj: any, username: string) {
    // let singleWIdget = await this.getSingleProduct(widgetId);
    let userObj = await this.getOneUser(username);
    if(userObj){
      let widgetObjIndex = userObj.cartwidgets.findIndex(x => x.details.id == detailObj.id);
      userObj.cartwidgets[widgetObjIndex].details = detailObj;
      // userObj.save();
    }

    // const userObj = await this.getOneUser(username);
    const result = await userObj.update({
      $set: {
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        username: userObj.username,
        password: userObj.password,
        accessToken: userObj.accessToken,
        purchasedwidgets: userObj.purchasedwidgets,
        cartwidgets: userObj.cartwidgets
      }
    })

    if (result.n === 0) {
      throw new NotFoundException(`Error occured !`,
      );
    }

    return userObj;
  }

  async DeleteWidgetFromCart(widgetId: Number, username: string) {
    let userObj = await this.getOneUser(username);
    let ind = userObj.cartwidgets.findIndex(x => x.widget.id == widgetId);
    userObj.cartwidgets.splice(ind,1)
    userObj.save();

    return userObj;
  }

  async findbytoken(token:any){
    const user = await this.userModel.findOne({ accessToken : token }).exec();
    return user;
  }

  async getSingleWidget(pid: Number){
    const widget = await this.userModel.findOne({ id: pid }).exec();
    return widget;
  }

  async deleteProduct(prodId: string) {
    const result = await this.userModel.deleteOne({_id: prodId}).exec();
    if (!result) {
      throw new NotFoundException('Could not find product.');
    }
  }

  private async findProduct(id: string): Promise<User> {
    let product;
    try {
      product = await this.userModel.find({ id: Number(id) }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}