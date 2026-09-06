import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from './user.entitiy';

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

  @Column({ type: 'jsonb', nullable: true })
  // Se almacenan como JSONB porque solo necesitamos guardarlas y mostrarlas,
  // sin necesidad de tratarlas como entidades independientes.
  addresses?:
    | {
        id: number;
        name?: string;
        street?: string;
        city?: string;
        state?: string;
        country?: string;
      }[]
    | null;

  @Column({ type: 'jsonb', nullable: true })
  favorites?: number[];

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
