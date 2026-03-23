import type { IErrorsTypeORM } from '../interfaces/errors-type-orm.interface';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorHandleService {
  private readonly logger = new Logger('ErrorHandleService');

  constructor() {}
  public errorHandle(error: IErrorsTypeORM) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error');
  }
}
