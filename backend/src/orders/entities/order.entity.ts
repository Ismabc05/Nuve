import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../models/order.status';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ACTIVE })
  status!: OrderStatus;

  @Column({ type: 'decimal', scale: 2 })
  total!: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}
