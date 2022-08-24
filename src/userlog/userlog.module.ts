import { UserSchema } from '../users/users.model';
import { UserService } from '../users/users.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserlogsController } from './userlog.controller';
import { UserlogsService } from './userlog.service';
import { UserlogSchema } from './userlog.model';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/users/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Userlog', schema: UserlogSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserlogsController],
  providers: [UserlogsService, UserService],
})
export class UserlogsModule {}