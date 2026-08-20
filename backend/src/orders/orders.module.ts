import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrderItemController } from './controllers/order-item.controller';
import { OrderItemService } from './services/order-item.service';

@Module({
  controllers: [OrdersController, OrderItemController],
  providers: [OrdersService, OrderItemService],
})
export class OrdersModule {}
