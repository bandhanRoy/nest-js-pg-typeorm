import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'uid' })
  userId!: string;

  @Column()
  accessToken!: string;

  @Column()
  accessTokenExpiresIn!: number;

  @Column()
  refreshToken!: string;

  @Column()
  refreshTokenExpiresIn!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'uid' })
  createdBy!: string;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'uid' })
  updatedBy?: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deletedBy', referencedColumnName: 'uid' })
  deletedBy?: string;
}
