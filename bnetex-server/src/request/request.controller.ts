import { Body, Controller, Get, Param, Post, Put, UseGuards, Headers } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
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
    @Get('/user')
    findUserRequests(@Headers('Authorization') token: string) {
        return this.requestService.getAllUserRequest();
    }

    @ApiOperation({
        summary : 'Create request type'
    })
    @Put('/type')
    addStatus(@Body() dto : CreateRequestTypeDto) {
        return this.requestService.addRequestType(dto);
    }

    @ApiOperation({
        summary : 'Show request type by id'
    })
    @Get('/type/:id')
    getStatus(@Param('id') id: number) {
        return this.requestService.getTransactionStatusNameById(id);
    }

    @ApiOperation({
        summary : 'Show all request types'
    })
    @Get('/type')
    getAllStatuses() {
        return this.requestService.getAllTransactionStatuses();
    }
}
