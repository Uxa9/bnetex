import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetDataDto } from './dto/get-data.dto';
import { PositionsService } from './positions.service';
import { GetPositionsDto } from './dto/get-positions.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('positions')
@ApiTags('Positions')
export class PositionsController {
    constructor(private positionsService: PositionsService) {}

    @Get()
    @ApiOperation({ summary: 'Get historical positions data' })
    getHistoricalDataOrders(@Query() dto: GetPositionsDto) {
        return this.positionsService.getHistoricalDataOrders(dto);
    }

    @Post('getHistData')
    @ApiOperation({ summary: 'Get histograms data' })
    getData(@Body() dto: GetDataDto) {
        return this.positionsService.getPnlAndRoe(dto);
    }

    @Post('getTVDAta')
    @ApiOperation({ summary: 'Get TV data' })
    getTVDAta(@Body() dto: any) {
        return this.positionsService.getTVdata(dto);
    }

    // TODO: Bot guard
    @Post('close-callback')
    @ApiOperation({ summary: 'Close position by Bot' })
    async closeCallback(@Body() dto: any) {
        await this.positionsService.closeCallback(dto);
        return { status: 'success' };
    }
}
