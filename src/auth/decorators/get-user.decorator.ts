import { User } from '../entities/user.entity';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ user: User }>();
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException('User not found in request');
  }

  return !data ? user : user[data as keyof User];
});
