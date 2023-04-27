import { Controller, Get, Post, Body, UseGuards, UsePipes, Param, Put, Headers, HttpCode, Request } from '@nestjs/common';
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
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { UserCreatedSuccess } from './responseTypes/userCreatedType';
import { RoleNotFound } from 'src/exceptions/role/roleNotFound.exception';
import { UserAlreadyExist } from 'src/exceptions/user/userAlreadyExist.exception';
import { InternalServerError } from 'src/exceptions/internalError.exception';
import { UserWrongPassword } from 'src/exceptions/user/userWrongPassword.exceptions';


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

    @ApiOperation({
        summary : 'Get all users'
    })
    @ApiResponse({
        status : 200,
        type : [User]
    })
    @ApiException(() => [
        InternalServerError
    ])
    @Roles('admin')
    @UseGuards(RolesGuard)
    @Get('/all')
    getAll() {
        return this.userService.getAllUsers();
    }

    @ApiOperation({
        summary : 'Change user password'
    })
    @ApiResponse({
        status : 200,
        type : [User]
    })
    @ApiException(() => [
        UserWrongPassword,
        InternalServerError
    ])
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
    getWallets(@Request() req: any) {
        return this.userService.getWallets(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getpnl')
    getPnL(@Request() req: any) {
        return this.userService.getPnL(req.user.id);
    }


    @UseGuards(JwtAuthGuard)
    @Get('/info')
    info(@Request() req: any) {
        return this.userService.getUserById(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getroe')
    getRoE(@Request() req: any) {
        return this.userService.getRoE(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getRoeAndPnl')
    getRoeAndPnl(@Request() req: any) {
        return this.userService.getUserPnlAndRoe(req.user.id);
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
    startInvest(@Body() dto: StartInvestDto, @Request() req: any) {
        return this.userService.startInvest(dto, req.user.id);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/stopInvest')
    stopInvest(@Request() req: any) {
        return this.userService.stopInvest(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/invest')
    getUserTradeSession(@Request() req: any) {
        return this.userService.getUserActiveSession(req.user.id);
    }
    
    @Get('/totalInvestAmount/get')
    getTotalInvestAmount() {
        return this.userService.getTotalInvestAmount();
    }

    @UseGuards(JwtAuthGuard)
    @Get('invest/positions')
    getOpenUserPosition(@Request() req: any) {
        
        return this.userService.getCurrentOpenPosition(req.user.id);
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