import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
