import { UserSchema } from './../users/users.model';
import { UserService } from './../users/users.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSchema } from './products.model';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/users/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, UserService],
})
export class ProductsModule {}