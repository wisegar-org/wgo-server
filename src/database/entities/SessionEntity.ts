import { Entity, Column } from 'typeorm';
import { ISessionLicenze } from '../../models/Models';
import { OGBaseEntity } from './OGBaseEntity';

@Entity({ name: 'session' })
export class SessionEntity extends OGBaseEntity {
  @Column()
  userId!: string;
  @Column()
  email!: string;
  @Column('text', { array: true, default: '{}' })
  roles!: string[];
  @Column('json', { nullable: true })
  permissions!: { [key: string]: string };
  @Column({ type: 'jsonb', nullable: true })
  extra!: { [key: string]: unknown };
  @Column({ type: 'jsonb', nullable: true })
  applicazioni!: ISessionLicenze;
  uuid!: string;
}
