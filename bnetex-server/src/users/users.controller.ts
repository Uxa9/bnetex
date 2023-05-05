import { Controller, Get, Post, Body, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { User } from './users.model';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { TransferMoney } from './dto/transfer-money.dto';
import { StartInvestDto } from './dto/start-invest.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { InternalServerError } from 'src/exceptions/internalError.exception';
import { UserWrongPassword } from 'src/exceptions/user/userWrongPassword.exceptions';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ReqUser } from 'src/auth/req-user.decorator';


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    // А по идее это не надо
    // @ApiOperation({
    //     summary : 'Create user'
    // })
    // @ApiResponse({
    //     status : 201,
    //     type : UserCreatedSuccess
    // })
    // @ApiException(() => [
    //     RoleNotFound,
    //     UserAlreadyExist,
    //     InternalServerError
    // ])
    // @Put()
    // @HttpCode(201)
    // create(@Body() userDto: CreateUserDto) {
    //     return this.userService.createUser(userDto);
    // }

    @Get('all')
    @ApiOperation({ summary : 'Get all users' })
    @ApiOkResponse({ type : [User] })
    @ApiException(() => [InternalServerError])
    @Roles('admin')
    @UseGuards(RolesGuard)
    getAll() {
        return this.userService.getAllUsers();
    }
    
    @Post('changePassword')
    @ApiOperation({ summary : 'Change user password' })
    @ApiOkResponse({ type : [User] })
    @ApiException(() => [
        UserWrongPassword,
        InternalServerError
    ])
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    changePassword(@Body() dto: ChangePasswordDto, @ReqUser() user: User) {
        return this.userService.changePassword(dto, user);
    }

    @Get('getWallets')
    @ApiOperation({ summary : 'Kakaphony, remove later' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    getWallets(@ReqUser() user: User) {
        return this.userService.getWallets(user);
    }

    @Get('getpnl')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    getPnL() {
        return this.userService.getPnL();
    }

    @Get('info')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    info(@ReqUser() user: User) {
        return user;
    }

    @Get('getroe')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    getRoE() {
        return this.userService.getRoE();
    }

    @Get('getRoeAndPnl')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    getRoeAndPnl(@ReqUser() user: User) {
        return this.userService.getUserPnlAndRoe(user.id);
    }

    @Post('transfer-money')
    @ApiOperation({ summary : 'Transfer money between wallet' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    transferMoney(@Body() dto: TransferMoney, @ReqUser() user: User) {
        return this.userService.transferMoney(dto, user);
    }
    
    @Post('role')
    @ApiOperation({ summary : 'Add user role' })
    @ApiBearerAuth()
    @Roles('admin')
    @UseGuards(JwtGuard, RolesGuard)
    addRole(@Body() dto: AddRoleDto, @ReqUser() user: User) {
        return this.userService.addRole(dto, user.id);
    }

    @Post('startInvest')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    startInvest(@Body() dto: StartInvestDto, @ReqUser() user: User) {
        return this.userService.startInvest(dto, user);
    }
    
    @Get('stopInvest')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    stopInvest(@ReqUser() user: User) {
        return this.userService.stopInvest(user);
    }

    @Get('invest')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    getUserTradeSession(@ReqUser() user: User) {
        return this.userService.getUserActiveSession(user);
    }

    @Get('invest/positions')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    getOpenUserPosition(@ReqUser() user: User) {
        return this.userService.getCurrentOpenPosition(user);
    }

    @Put('set-api')
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    setUserApiKey(@Body() dto: any, @ReqUser() user: User) {
        return this.userService.setApiKey(dto, user);
    }
}