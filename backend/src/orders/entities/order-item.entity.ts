import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'order-items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  @Exclude()
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  @Exclude()
  updatedAt!: Date;

  @ManyToOne(() => Order, (order) => order.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order!: Order;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.orderitems,
    { nullable: false },
  )
  productvariant!: ProductVariant;
}
