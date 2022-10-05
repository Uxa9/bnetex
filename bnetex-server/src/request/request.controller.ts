import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRequest } from './dto/create-request.dto';
import { FulfillRequest } from './dto/fulfill-request.dto';
import { RequestService } from './request.service';

@ApiTags('Request')
@Controller('request')
export class RequestController {

    constructor(private requestService: RequestService) {}

    @ApiOperation({
        summary : 'Create request'
    })
    @Post('/create')
    create(@Body() dto: CreateRequest) {
        return this.requestService.createRequest(dto);
    }

    @ApiOperation({
        summary : 'Fulfill request'
    })
    @Post('/fulfill')
    fulfill(@Body() dto: FulfillRequest) {
        return this.requestService.fulfillRequest(dto);
    }

    @ApiOperation({
        summary : 'Find all user requests'
    })
    @Get('/user/:id')
    findUserRequests(@Param('id') id: number) {
        return this.requestService.getAllUserRequest(id);
    }
}
