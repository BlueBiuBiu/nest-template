import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from '../../role/entities/role.entity';
import { Upload } from 'src/upload/entities/upload.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  sex: string;

  @Column()
  password: string;

  @ManyToMany(() => Roles, (roles) => roles.user)
  @JoinTable({ name: 'user_roles' })
  roles: Roles[];

  @OneToOne(() => Upload, (upload) => upload.user)
  avatar: Upload;
}
