import { userDto } from './../dto/userdto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import { generateCode } from 'src/Utils/HelperFunctions';
const nodemailer = require("nodemailer");
import { JwtService } from '@nestjs/jwt';
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

@Injectable()
export class UserService {
  static findbytoken: any;
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>, private jwtService: JwtService
  ) {}

  async insertUser(userDto : userDto): Promise<User> {
    // const newProduct = new this.userModel({
    //   title,
    //   description: desc,
    //   price,
    // });
    // const result = await newProduct.save();
    // return result.id as Number;

    let newtoken = generateCode(15);

    return await new this.userModel({...userDto, accessToken: this.jwtService.sign(userDto), createdAt: new Date()}).save();

  }

  async validateUser(userDto : any) {
    let user = await this.getOneUser(userDto.username);
    let obj = {};
    let tokenObj = {
      "username": user.username,
      "id": user._id
    }
    if (!user) {
      // throw new NotFoundException('Could not find User.');
      obj['authenticated'] = false;
      obj['errorMsg'] = "No such user !";
    }
    else if(!user.isEmailVerified){
      obj['authenticated'] = true;
      obj['isEmailVerified'] = false;
      obj['errorMsg'] = "Please verify your email first !";
    }
    else{
      if(userDto.password == user.password){
        obj['authenticated'] = true;
        obj['username'] = user.username;
        obj['isEmailVerified'] = user.isEmailVerified;
        user.accessToken = "";
        user.accessToken = this.jwtService.sign(JSON.parse(JSON.stringify(tokenObj)));

        this.partialUserUpdate(user)

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
      isEmailVerified: user.isEmailVerified,
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
      isEmailVerified: user.isEmailVerified,
      accessToken: user.accessToken,
      purchasedwidgets: user.purchasedwidgets,
      cartwidgets: user.cartwidgets,
      phoneNumber: user.phoneNumber,
      organization: user.organization,
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
    }

    const result = await userObj.update({
      $set: {
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        username: userObj.username,
        password: userObj.password,
        isEmailVerified: userObj.isEmailVerified,
        accessToken: userObj.accessToken,
        purchasedwidgets: userObj.purchasedwidgets,
        cartwidgets: userObj.cartwidgets,
        phoneNumber: userObj.phoneNumber,
        organization: userObj.organization
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

  async PurchaseCartWidgets(username: string) {

    let userObj = await this.getOneUser(username);

    if(userObj){
      let allCartWidgets = userObj.cartwidgets.slice();
      allCartWidgets.map((widget:any) => {
        widget.details['purchase_date'] = this.getDateInFormat();
        widget.details['purchase_time'] = this.getTimeInFormat();
      })
      userObj.purchasedwidgets = userObj.purchasedwidgets.concat(allCartWidgets.slice());
      userObj.cartwidgets = [];
    }

    const result = await userObj.update({
      $set: {
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        username: userObj.username,
        password: userObj.password,
        isEmailVerified: userObj.isEmailVerified,
        accessToken: userObj.accessToken,
        purchasedwidgets: userObj.purchasedwidgets,
        cartwidgets: userObj.cartwidgets,
        phoneNumber: userObj.phoneNumber,
        organization: userObj.organization
      }
    })

    if (result.n === 0) {
      throw new NotFoundException(`Error occured !`,
      );
    }

    return userObj;
  }

  async PausePlayWidgets(detailsObj: object) {

    let details = JSON.parse(JSON.stringify(detailsObj));

    let sample = {
      username : "",
      widgetId : 1,
      is_paused: true
    }

    let userObj = await this.getOneUser(details.username);

    if(userObj){
      userObj.purchasedwidgets.filter((wid:any) => wid.widget.id == details.widgetId)[0].details.is_paused = details.is_paused;
    }

    const result = await userObj.update({
      $set: {
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        username: userObj.username,
        password: userObj.password,
        isEmailVerified: userObj.isEmailVerified,
        accessToken: userObj.accessToken,
        purchasedwidgets: userObj.purchasedwidgets,
        cartwidgets: userObj.cartwidgets,
        phoneNumber: userObj.phoneNumber,
        organization: userObj.organization,
      }
    })

    if (result.n === 0) {
      throw new NotFoundException(`Error occured !`,
      );
    }

    return userObj;
  }

  async verifyEmail(token: Number){
    let user = await this.findbytoken(token);
    let returnObj = {
      "username": null,
      "isEmailVerified": false
    }
    if(user){
      user.isEmailVerified = true;
      returnObj.username = user.username;
      returnObj.isEmailVerified = true;
    }
    else{
      returnObj.username = null;
      returnObj.isEmailVerified = false;
    }

    const result = await user.update({
      $set: {
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        password: user.password,
        isEmailVerified: user.isEmailVerified,
        accessToken: user.accessToken,
        purchasedwidgets: user.purchasedwidgets,
        cartwidgets: user.cartwidgets,
        phoneNumber: user.phoneNumber,
        organization: user.organization
      }
    })

    if (result.n === 0) {
      throw new NotFoundException(`Error occured !`,
      );
    }

    return returnObj;

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

  getDateInFormat = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm:any = today.getMonth() + 1; // Months start at 0!
    let dd:any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;

    return formattedToday;
  }

  getTimeInFormat = () => {
    let date = new Date();
    let timeformat = date.toLocaleTimeString();
    return timeformat;
  }

  async updateUser(obj: userDto){
    let user = await this.getOneUser(obj.username);
    if(user){
      const result = await user.update({
        $set: {
          firstname: obj.firstname,
          lastname: obj.lastname,
          username: obj.username,
          password: obj.password,
          isEmailVerified: obj.isEmailVerified,
          accessToken: obj.accessToken,
          purchasedwidgets: obj.purchasedwidgets,
          cartwidgets: obj.cartwidgets,
          phoneNumber: obj.phoneNumber,
          organization: obj.organization
        }
      })
  
      if (result.n === 0) {
        throw new NotFoundException(`Error occured !`,
        );
      }

    }
    else{
      throw new BadRequestException(`Error`);
    }
  }

  async partialUserUpdate(obj: userDto){
    let user = await this.getOneUser(obj.username);
    if(user){
      const result = await user.update({
        $set: {
          firstname: obj.firstname != null ? obj.firstname : user.firstname,
          lastname: obj.lastname != null ? obj.lastname : user.lastname,
          username: obj.username != null ? obj.username : user.username,
          password: obj.password != null ? obj.password : user.password,
          isEmailVerified: obj.isEmailVerified != null ? obj.isEmailVerified : user.isEmailVerified,
          accessToken: obj.accessToken != null ? obj.accessToken : user.accessToken,
          purchasedwidgets: obj.purchasedwidgets != null ? obj.purchasedwidgets : user.purchasedwidgets,
          cartwidgets: obj.cartwidgets != null ? obj.cartwidgets : user.cartwidgets,
          phoneNumber: obj.phoneNumber != null ? obj.phoneNumber : user.phoneNumber,
          organization: obj.organization != null ? obj.organization : user.organization
        }
      })
  
      if (result.n === 0) {
        throw new NotFoundException(`Error occured !`,
        );
      }

      return user;

    }
    else{
      throw new BadRequestException(`Error`);
    }
  }

  async sendEmail() {
    const transporter = await nodemailer.createTransport({
      // service: "office365",
      port: 5000,
      secure: false,
      auth: {
        user: 'e2e.portal@e2eresearch.com',
        pass: 'WorlD#$123987%'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    var mailOptions = {
      from: 'e2e.portal@e2eresearch.com',
      to: 'gaurav.sekhri@e2eresearch.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };

    await transporter.verify(function(error, success) {
      if (error) {
           console.log(error);
      } else {
           console.log('Server is ready to take our messages');
      }
    });
    
    await transporter.sendMail(mailOptions, function(error:any, info:any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

}