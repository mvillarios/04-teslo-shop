import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUuid } from 'uuid';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { IErrorsTypeORM } from '../common/interfaces/errors-type-orm.interface';
import { ErrorHandleService } from '../common/services/error-handle.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly datasource: DataSource,

    private readonly errorHandler: ErrorHandleService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productsRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.errorHandler.errorHandle(error as IErrorsTypeORM);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    });
    return products.map((products) => ({
      ...products,
      images: products.images!.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUuid(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(
        `Product with id, slug or title "${term}" not found`,
      );
    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((img) => img.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productsRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    //Create Query Runner
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      //await this.productsRepository.save(product);

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.errorHandler.errorHandle(error as IErrorsTypeORM);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return;
  }

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.errorHandler.errorHandle(error as IErrorsTypeORM);
    }
  }
}
