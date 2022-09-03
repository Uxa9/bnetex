import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @ApiOperation({
        summary : 'Create role'
    })
    @ApiResponse({
        status : 200,
        type : Role
    })
    @Post()
    create(@Body() dto : CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @ApiOperation({
        summary : 'Get role by id'
    })
    @ApiResponse({
        status : 200,
        type : Role
    })
    @Get('/:value')
    getByValue(@Param('value') value : string) {
        return this.roleService.getRoleByValue(value);
    }
}
