import { Controller, Get, Post, Body, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { TransferMoney } from './dto/transfer-money.dto';
import { WithdrawMoney } from './dto/withdraw-money.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @ApiOperation({
        summary : 'Create user'
    })
    @ApiResponse({
        status : 200,
        type : User
    })
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({
        summary : 'Get all users'
    })
    @ApiResponse({
        status : 200,
        type : [User]
    })
    @Roles('admin')
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.userService.getAllUsers();
    }

    @ApiOperation({
        summary : 'Transfer money between wallets'
    })
    @Roles('admin')
    @UseGuards(RolesGuard)
    @Post('/transfer-money')
    transferMoney(@Body() dto: TransferMoney) {
        return this.userService.transferMoney(dto);
    }

    @ApiOperation({
        summary : 'Withdraw money from main wallet'
    })
    @Roles('admin')
    @UseGuards(RolesGuard)
    @Post('/withdraw')
    withdrawMoney(@Body() dto: WithdrawMoney) {
        return this.userService.withdrawMoney(dto);
    }

    @ApiOperation({
        summary : 'Add user role'
    })
    @Roles('admin')
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto);
    }
}
