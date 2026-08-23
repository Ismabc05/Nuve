import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  password!: string;
}
