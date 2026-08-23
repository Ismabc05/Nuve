import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastname!: string;

  @Column({ type: 'int', nullable: true })
  phone!: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  image!: string;

  @Column({ type: 'int', nullable: true })
  zip_code!: number;
}
