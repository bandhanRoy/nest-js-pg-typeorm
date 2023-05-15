import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Phone {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  area_code: string;

  @Column()
  number: string;
}
