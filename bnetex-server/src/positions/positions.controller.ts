import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetDataDto } from './dto/get-data.dto';
import { PositionsService } from './positions.service';
import { GetPositionsDto } from './dto/get-positions.dto';

@Controller('positions')
export class PositionsController {
    constructor(private PositionService: PositionsService) {}

    @Get()
    getHistoricalDataOrders(@Query() dto: GetPositionsDto) {
        return this.PositionService.getHistoricalDataOrders(dto);
    }

    @Post('/getHistData')
    getData(@Body() dto: GetDataDto) {
        return this.PositionService.getPnlAndRoe(dto);
    }

    @Post('/getTVDAta')
    getTVDAta(@Body() dto: any) {
        return this.PositionService.getTVdata(dto);
    }
}
