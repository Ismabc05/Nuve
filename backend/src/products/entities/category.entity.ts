import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm/browser';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;
}
