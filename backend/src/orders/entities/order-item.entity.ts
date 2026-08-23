import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order-items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'int' })
  unitPrice!: number;
}
