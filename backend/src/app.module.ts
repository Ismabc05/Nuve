import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersService } from './orders/services/orders.service';
import { OrdersController } from './orders/controllers/orders.controller';
import { OrdersModule } from './orders/orders.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    OrdersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService, OrdersService],
})
export class AppModule {}
