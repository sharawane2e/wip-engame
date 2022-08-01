import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';

var username = encodeURIComponent('e2e');
var password = encodeURIComponent('research#345');

@Module({
  imports: [
    ProductsModule,
    CartModule,
    UsersModule,
    // MongooseModule.forRoot(
    //   'mongodb+srv://admin:admin@cluster0.n5rp3k3.mongodb.net/?retryWrites=true&w=majority',
    // )
    MongooseModule.forRoot(
      `mongodb://${username}:${password}@localhost:27017/engame`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
