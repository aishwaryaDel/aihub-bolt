import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { UseCaseAttributes } from '../types';

@Table({
  tableName: 'use_cases',
  timestamps: true,
  underscored: true,
})
export class UseCase extends Model<UseCaseAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  short_description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  full_description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  benefits!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  department!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  status!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  application_url?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  sharepoint_url?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  confluence_url?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  image_url?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updated_at!: Date;
}
