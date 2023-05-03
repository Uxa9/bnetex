import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetDataDto } from './dto/get-data.dto';
import { PositionsService } from './positions.service';
import { GetPositionsDto } from './dto/get-positions.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('positions')
@ApiTags('Positions')
export class PositionsController {
    constructor(private PositionService: PositionsService) {}

    @Get()
    @ApiOperation({ summary: 'Get historical positions data' })
    getHistoricalDataOrders(@Query() dto: GetPositionsDto) {
        return this.PositionService.getHistoricalDataOrders(dto);
    }

    @Post('getHistData')
    @ApiOperation({ summary: 'Get histograms data' })
    getData(@Body() dto: GetDataDto) {
        return this.PositionService.getPnlAndRoe(dto);
    }

    @Post('getTVDAta')
    @ApiOperation({ summary: 'Get TV data' })
    getTVDAta(@Body() dto: any) {
        return this.PositionService.getTVdata(dto);
    }
}
