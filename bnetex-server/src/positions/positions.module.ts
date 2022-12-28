import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { Position } from './position.model';
import { PositionEnters } from './positionEnters.model';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
// import { Position, _positionSchema } from './shemas/_position.schema';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [
    SequelizeModule.forFeature([Position, PositionEnters]),
    // MongooseModule.forFeature([{ name: Position.name, schema: _positionSchema }])
  ],
  exports: [
    PositionsService
  ]
})
export class PositionsModule {}
