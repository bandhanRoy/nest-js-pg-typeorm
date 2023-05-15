import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Phone } from './phone.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToOne(() => Phone)
  @JoinColumn()
  phone: Phone;

  @Column({ type: Boolean, default: false })
  isActive!: boolean;

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

  @BeforeInsert()
  updateUID() {
    if (!this.uid) {
      const uid = uuid();
      this.uid = uid;
      this.createdBy = uid;
    }
  }
}
