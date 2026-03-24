import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FilesService {
  constructor(private cloudinary: CloudinaryService) {}

  async uploadProductImage(file: Express.Multer.File) {
    const { url } = (await this.cloudinary.uploadImage(file).catch(() => {
      throw new Error('Failed to upload image to Cloudinary');
    })) as { url: string };
    return { url };
  }
}
