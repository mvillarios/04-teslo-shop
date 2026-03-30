import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product-image.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'b9a1c2d3-e4f5-6789-0abc-def123456789',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title!: string;

  @ApiProperty({
    example: 200.99,
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price?: number;

  @ApiProperty({
    example: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'Product description',
    default: null,
  })
  @Column('text', {
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    example: 't-shirt-teslo',
    description: 'Product slug for SEO',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug?: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock?: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes!: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'Product gender',
  })
  @Column('text')
  gender!: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Product tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags!: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user!: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
