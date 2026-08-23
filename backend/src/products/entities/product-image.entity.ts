import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product-images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 200 })
  url!: string;
}
