import { Controller, Get, Post, Body, Param, UseGuards, Put, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { RolesService } from './roles.service';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { RoleDoubleFound } from 'src/exceptions/role/roleDouble.exception';
import { InternalServerError } from 'src/exceptions/internalError.exception';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @ApiOperation({
        summary : 'Create role'
    })
    @ApiResponse({
        status : 201,
        type : Role
    })
    @HttpCode(201)
    @ApiException(() => [
        RoleDoubleFound,
        InternalServerError
    ])
    @Roles('admin') 
    @UseGuards(RolesGuard)
    @Put('')
    create(@Body() dto : CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    // @ApiOperation({
    //     summary : 'Get role by name'
    // })
    // @ApiResponse({
    //     status : 200,
    //     type : Role
    // })
    // @ApiException(() => InternalServerError)
    // @Get('/:name')
    // getByValue(@Param('name') name : string) {
    //     return this.roleService.getRoleByName(name);
    // }
}
