import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { IErrorsTypeORM } from '../common/interfaces/errors-type-orm.interface';
import { ErrorHandleService } from '../common/services/error-handle.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly errorHandler: ErrorHandleService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      this.errorHandler.errorHandle(error as IErrorsTypeORM);
    }
  }

  async findAll() {
    return this.productsRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
    } catch (error: any) {
      this.errorHandler.errorHandle(error as IErrorsTypeORM);
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
