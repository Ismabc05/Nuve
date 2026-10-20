import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';

import { Order } from '../entities/order.entity';
import { UpdateOrderDto } from '../dtos/order.dto';
import { OrderStatus } from '../models/order.status';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async findAll(userId?: number) {
    if (userId) {
      return await this.orderRepo.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
          items: {
            productvariant: {
              product: {
                images: true,
              },
            },
          },
        },
      });
    }

    return await this.orderRepo.find({
      relations: {
        user: true,
        items: {
          productvariant: {
            product: {
              images: true,
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: {
          productvariant: {
            product: {
              images: true,
            },
          },
        },
        user: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Order no encontrada');
    }
    return order;
  }

  async createOrder(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const activeOrder = await this.orderRepo.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.ACTIVE,
      },
    });

    if (activeOrder) {
      throw new ConflictException('El usuario ya tiene una orden activa');
    }

    const order = this.orderRepo.create({
      user,
      status: OrderStatus.ACTIVE,
      total: 0,
      items: [],
    });

    return await this.orderRepo.save(order);
  }

  async update(id: number, body: UpdateOrderDto) {
    const profile = await this.findOne(id);
    const updateOrder = this.orderRepo.merge(profile, body);
    const savedOrder = await this.orderRepo.save(updateOrder);
    return savedOrder;
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.ACTIVE) {
      throw new ConflictException(
        'No se puede eliminar un pedido que ya ha sido procesado',
      );
    }
    await this.orderRepo.remove(order);
    return {
      meesage: 'Pedido borrado correctamente',
    };
  }

  async createCheckoutSession(orderId: number, userId: number) {
    const order = await this.findOne(orderId);

    if (order.user.id !== userId) {
      throw new BadRequestException('No puedes pagar esta orden');
    }

    if (order.status !== OrderStatus.ACTIVE) {
      throw new ConflictException('La orden no está activa');
    }

    if (order.paid) {
      throw new ConflictException('La orden ya ha sido pagada');
    }

    if (!order.items?.length) {
      throw new BadRequestException('La orden no tiene productos');
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.productvariant.product.name,
        },
        unit_amount: Math.round(
          Number(item.productvariant.product.price) * 100,
        ),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/orders/${order.id}`,
      metadata: {
        orderId: order.id.toString(),
        userId: order.user.id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await this.orderRepo.save(order);

    return {
      url: session.url,
    };
  }

  async handleStripeWebhook(session: Stripe.Checkout.Session) {
    if (session.payment_status !== 'paid') {
      return { message: 'El pago todavía no está confirmado' };
    }

    const orderId = Number(session.metadata?.orderId);

    if (!orderId) {
      throw new BadRequestException('La sesión de Stripe no tiene orderId');
    }

    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Comprueba que la sesión corresponde al pedido.
    if (order.stripeSessionId && order.stripeSessionId !== session.id) {
      throw new BadRequestException(
        'La sesión de Stripe no corresponde a este pedido',
      );
    }

    // Marca el pedido como completado solo si aún no se procesó.
    if (!order.paid) {
      order.paid = true;
      order.status = OrderStatus.COMPLETED;
      await this.orderRepo.save(order);
    }

    // También se ejecuta si Stripe reenvía el evento.
    await this.createEmptyActiveOrder(order.user.id);

    return {
      message: 'Pago procesado y carrito activo comprobado',
    };
  }

  private async createEmptyActiveOrder(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const existingActiveOrder = await this.orderRepo.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.ACTIVE,
      },
    });

    if (existingActiveOrder) {
      return existingActiveOrder;
    }

    const newOrder = this.orderRepo.create({
      user,
      status: OrderStatus.ACTIVE,
      total: 0,
      items: [],
    });

    return this.orderRepo.save(newOrder);
  }
}
