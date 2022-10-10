import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    create(@Body() dto: CreateRequest) {
        return this.requestService.createRequest(dto);
    }

    @ApiOperation({
        summary : 'Fulfill request'
    })
    @UseGuards(JwtAuthGuard)
    @Post('/fulfill')
    fulfill(@Body() dto: FulfillRequest) {
        return this.requestService.fulfillRequest(dto);
    }

    @ApiOperation({
        summary : 'Find all user requests'
    })
    @UseGuards(JwtAuthGuard)
    @Get('/user/:id')
    findUserRequests(@Param('id') id: number) {
        return this.requestService.getAllUserRequest(id);
    }
}
