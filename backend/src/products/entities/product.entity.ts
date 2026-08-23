import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'decimal', scale: 2 })
  price!: number;

  @Column({ type: 'varchar', length: 300 })
  description!: string;

  @Column({ type: 'int' })
  stock!: number;
}
