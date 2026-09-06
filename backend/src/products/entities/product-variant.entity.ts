import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Product } from './product.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity({ name: 'product-variants' })
@Unique(['product', 'size', 'color'])
// No puede haber dos variantes del mismo producto con el mismo tamaño y color.
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  size!: string;

  @Column({ type: 'varchar', length: 50 })
  color!: string;

  @Column({ type: 'int' })
  stock!: number;

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

  @ManyToOne(() => Product, (product) => product.variants, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product!: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productvariant)
  orderitems!: OrderItem[];
}
