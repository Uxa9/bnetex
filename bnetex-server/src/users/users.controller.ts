import { Controller, Get, Post, Body, UseGuards, UsePipes, Param, Put, Headers, HttpCode } from '@nestjs/common';
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
        status : 201,
        type : User
    })
    @Put()
    @HttpCode(201)
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
    @Get('/all')
    getAll() {
        return this.userService.getAllUsers();
    }

    // @UseGuards(RolesGuard)
    // @Get('/:id')
    // getUser(@Param('id') id: number) {
    //     return this.userService.getUser(id);
    // }

    @UseGuards(JwtAuthGuard)
    @Post('/changePassword')
    changePassword(@Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(dto);
    }

// Нужно ли вот это вообще?

    @ApiOperation({
        summary : 'Kakaphony, remove later'
    })
    @UseGuards(JwtAuthGuard)
    @Get('/getWallets')
    getWallets(@Headers('Authorization') token: string) {
        return this.userService.getWallets();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getpnl')
    getPnL(@Headers('Authorization') token: string) {
        return this.userService.getPnL();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getroe')
    getRoE(@Headers('Authorization') token: string) {
        return this.userService.getRoE();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getRoeAndPnl')
    getRoeAndPnl(@Headers('Authorization') token: string) {
        return this.userService.getUserPnlAndRoe();
    }

    @ApiOperation({
        summary : 'Transfer money between wallet'
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
    @Get('/stopInvest')
    stopInvest() {
        return this.userService.stopInvest();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/invest')
    getUserTradeSession() {
        return this.userService.getUserActiveSession();
    }
    
    @Get('/totalInvestAmount/get')
    getTotalInvestAmount() {
        return this.userService.getTotalInvestAmount();
    }

    @UseGuards(JwtAuthGuard)
    @Get('invest/positions')
    getOpenUserPosition() {
        return this.userService.getCurrentOpenPosition();
    }

    @Put('set-api')
    setUserApiKey(@Body() dto: any) {
        return this.userService.setApiKey(dto);
    }

    @UseGuards(JwtAuthGuard)    
    @Get('test')
    test(@Headers('Authorization') token: string) {
        return this.userService.test();
    }
}