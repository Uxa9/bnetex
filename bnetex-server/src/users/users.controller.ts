import { Controller, Get, Post, Body, UseGuards, UsePipes, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { TransferMoney } from './dto/transfer-money.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserIdDto } from './dto/user-id.dto';
import { StartInvestDto } from './dto/start-invest.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    getUser(@Param('id') id: number) {
        return this.userService.getUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/changePassword')
    changePassword(@Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(dto);
    }

    @ApiOperation({
        summary : 'Kakaphony, remove later'
    })
    @Get('/getWallets/:id')
    getWallets(@Param('id') id: number) {
        return this.userService.getWallets(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getpnl/:id')
    getPnL(@Param('id') id: number) {
        return this.userService.getPnL(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getroe/:id')
    getRoE(@Param('id') id: number) {
        return this.userService.getRoE(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getRoeAndPnl/:id')
    getRoeAndPnl(@Param('id') id: number) {
        return this.userService.getUserPnlAndRoe(id);
    }

    @ApiOperation({
        summary : 'Transfer money between wallets'
    })
    @UseGuards(JwtAuthGuard)
    @Post('/transfer-money')
    transferMoney(@Body() dto: TransferMoney) {
        return this.userService.transferMoney(dto);
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

    @UseGuards(JwtAuthGuard)
    @Post('/startInvest')
    startInvest(@Body() dto: StartInvestDto) {
        return this.userService.startInvest(dto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/stopInvest/:id')
    stopInvest(@Param('id') id: number) {
        return this.userService.stopInvest(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/invest/:id')
    getUserTradeSession(@Param('id') id: number) {
        return this.userService.getUserActiveSession(id);
    }
    
    @Get('/totalInvestAmount/get')
    getTotalInvestAmount() {
        return this.userService.getTotalInvestAmount();
    }
}
