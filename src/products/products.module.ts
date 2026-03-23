import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandleService } from '../common/services/error-handle.service';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ErrorHandleService],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
