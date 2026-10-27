import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Profile } from './profile.entity';
import { Order } from '../../orders/entities/order.entity';
import { UserRole } from '../models/user.role';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200, unique: true })
  email!: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password!: string;

  // Columna donde guardamos el token de recuperacion
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    name: 'password_reset_token',
  })
  passwordResetToken!: string | null;

  // Columna donde está la fecha de expiracion del token
  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'password_reset_expires',
  })
  passwordResetExpires!: Date | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

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

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders!: Order[];
}
