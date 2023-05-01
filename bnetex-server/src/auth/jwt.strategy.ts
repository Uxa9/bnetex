import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User) private readonly userRepository: typeof User) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.PRIVATE_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findByPk(payload.id, { include: { all: true } });

    if (!user) {
      throw new UnauthorizedException({
        status : "ERROR",
        message : 'USER_NOT_AUTHORIZED'
      });
    }

    return user.toJSON();
  }
}
