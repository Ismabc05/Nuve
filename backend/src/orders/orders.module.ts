import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrderItemController } from './controllers/order-item.controller';
import { OrderItemService } from './services/order-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrdersController, OrderItemController],
  providers: [OrdersService, OrderItemService],
})
export class OrdersModule {}
