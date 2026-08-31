import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { User } from './user.entitiy';
import { Exclude } from 'class-transformer';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastname?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  zip_code?: string;

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

  @OneToOne(() => User, (user) => user.profile)
  user!: User;
}
