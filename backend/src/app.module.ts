import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersService } from './orders/services/orders.service';
import { OrdersController } from './orders/controllers/orders.controller';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ProductsModule, UsersModule, OrdersModule],
  controllers: [AppController, OrdersController],
  providers: [AppService, OrdersService],
})
export class AppModule {}
