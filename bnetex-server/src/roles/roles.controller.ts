import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';
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
    @Roles('admin')
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() dto : CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @ApiOperation({
        summary : 'Get role by name'
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
