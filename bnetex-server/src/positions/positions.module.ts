import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { Position, PositionSchema } from './shemas/position.schema';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [
    MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }])
  ]
})
export class PositionsModule {}
