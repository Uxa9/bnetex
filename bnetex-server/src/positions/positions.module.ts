import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { Position, _positionSchema } from './shemas/_position.schema';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [
    MongooseModule.forFeature([{ name: Position.name, schema: _positionSchema }])
  ],
  exports: [
    PositionsService
  ]
})
export class PositionsModule {}
