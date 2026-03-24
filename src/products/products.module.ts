import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandleService } from '../common/services/error-handle.service';
import { Product, ProductImage } from './entities';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ErrorHandleService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
