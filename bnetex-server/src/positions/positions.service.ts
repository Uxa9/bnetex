import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetDataDto } from './dto/get-data.dto';
import { Position, PositionDocument } from './shemas/position.schema';

@Injectable()
export class PositionsService {

    constructor(
        @InjectModel(Position.name) private PositionModel: Model<PositionDocument>
    ) {}

    async getPnlAndRoe(dto: GetDataDto) {
        const date = new Date().setMonth(new Date().getMonth() - dto.period);

        const positions = await this.PositionModel.find({
            enterTime: { $gte: date }
        });

        const result = await this.getHistoricalData(positions, dto.amount);
        
        return result;
    }

    async getHistoricalData(data: any, amount: number) {
        
        let dates  = [];
        let positionVolume = 0;
        let pnlValues = [];
        let roeValues = [];
        let acc = amount;

        data.map((position, index) => {
            const { positionEnters } = position;
    
            dates.push(new Date(position.closeTime).toLocaleDateString());
            const x = position.volumeUSDT / position.deposit * acc;
            const pnl = x * position.percentProfit / 100;

            index !== 0 ? 
                roeValues.push((roeValues[index-1] + position.percentProfit)):
                roeValues.push(position.percentProfit);
            pnlValues.push(pnl);

            acc+=pnl;            
        });

        return {
            dates,
            pnlValues,
            roeValues
        }
    }
}
