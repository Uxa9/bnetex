import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserNotFoundException } from '../exceptions/userNotFound.exception';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TransferMoney } from './dto/transfer-money.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService) { }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue('investor');

        user.$set('roles', [role.id])
            .then(() => {
                user.roles = [role];
            });

        return {
            status: "SUCCESS",
            message: "USER_CREATED"
        };
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: { all: true } });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true }
        });

        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);

        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }

        throw new UserNotFoundException();
    }

    async confirmEmail(id: number) {
        const user = await this.userRepository.findByPk(id);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        await user.update({ isActivated : true });
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findByPk(id);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async getWallets(id: number) {
        const user = await this.getUserById(id);

        return {
            mainWallet: user.mainWallet,
            investWallet: user.investWallet
        }
    }

    async transferMoney(dto: TransferMoney) {
        const user = await this.userRepository.findByPk(dto.userId);

        if ( !user ) {
            throw new UserNotFoundException();
        }

        if (!this.userRepository.getAttributes().hasOwnProperty(dto.reciever) ||
            !this.userRepository.getAttributes().hasOwnProperty(dto.sender)) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "ENTRED_WALLET_IS_NOT_EXIST"
                },
                HttpStatus.BAD_REQUEST
            );
        }

        if ( user[dto.reciever] < dto.amount ) {
            throw new HttpException(
                {
                    status: "ERROR",
                    message: "WALLET_AMOUNT_IS_LOWER_THAN_REQUESTED"
                },
                HttpStatus.BAD_REQUEST
            );
        }

        user[dto.sender] -= dto.amount;
        user[dto.reciever] += dto.amount;

        await user.save();

        return {
            status: "SUCCESS",
            message: "TRANSFER_SUCCESS"
        }
    }

    private generatenumber(max: number, min: number) {
        return Math.random() * (max - min) + min;
    }

    async getPnL(id: number) {        
        const user = await this.getUserById(id);

        return {
            pnl: {
                values: [
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                    this.generatenumber(200, -50),
                ],
                dates: [
                    '10.02',
                    '17.02',
                    '24.02',
                    '31.02',
                    '07.03',
                    '14.03',
                    '21.04'
                ]
            }
        }
    }

    async getRoE(id: number) {
        const user = await this.getUserById(id);

        return {
            roe: {
                values: [
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                    this.generatenumber(100, -10),
                ],
                dates: [
                    '10.02',
                    '17.02',
                    '24.02',
                    '31.02',
                    '07.03',
                    '14.03',
                    '21.04'
                ]
            }
        }
    }
}
