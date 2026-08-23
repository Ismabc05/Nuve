import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product-variants' })
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  size!: string;

  @Column({ type: 'varchar', length: 50 })
  color!: string;

  @Column({ type: 'int' })
  stock!: number;
}
