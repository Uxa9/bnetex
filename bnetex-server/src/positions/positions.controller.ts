import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetDataDto } from './dto/get-data.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController 
{
    constructor(private PositionService: PositionsService) {}

    @Post('/getHistData')
    getData(@Body() dto: GetDataDto) {
        return this.PositionService.getPnlAndRoe(dto);
    }

    @Get('/:period')
    getHistoricalDataOrders(@Param('period') period: number) {
        return this.PositionService.getHistoricalDataOrders(period);
    }

    @Post('/getTVDAta')
    getTVDAta(@Body() dto: any) {
        return this.PositionService.getTVdata(dto);
    }
}
