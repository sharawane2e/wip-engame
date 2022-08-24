import { UserService } from '../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { decrypt } from 'src/Utils/EncryptFunctions';

import { Userlog } from './userlog.model';
import { User } from 'src/users/users.model';

@Injectable()
export class UserlogsService {
  constructor(
    @InjectModel('Userlog') private readonly UserlogModel: Model<Userlog>,
    @InjectModel('User') private readonly UserModel: Model<User>,
  ) {}

  async insertLog(email: string, type: string, time: string, area: string) {
    const newLog = new this.UserlogModel({
      email,
      type,
      time,
      area,
    });
    const result = await newLog.save();
    return result.id as Number;
  }

  async getAllLogs() {
    const log = await this.UserlogModel.find().exec();
    return log.map(user => ({
      id: user.id,
      email: user.email,
      logs: user.logs
    }));
  }
}