import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as brcypt from 'bcrypt';
import { Repository } from 'typeorm';
import { IErrorsTypeORM } from '../common/interfaces/errors-type-orm.interface';
import { ErrorHandleService } from '../common/services/error-handle.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly errorHandler: ErrorHandleService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const salt = await brcypt.genSalt(10);
      const hashedPassword = await brcypt.hash(password, salt);
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.errorHandler.errorHandle(error as IErrorsTypeORM);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!brcypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        ...user,
        token: this.getToken({ id: user.id }),
      };
    } catch (error) {
      this.errorHandler.errorHandle(error as IErrorsTypeORM);
    }
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getToken({ id: user.id }),
    };
  }

  private getToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
