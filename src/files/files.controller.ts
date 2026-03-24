import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateProductImage } from './decorators/validate-product-image.decorator';
import { FilesService } from './files.service';
import {
  BadRequestException,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import type { Express } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file'))
  uploadProductImage(
    @ValidateProductImage()
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductImage(file);
  }
}
