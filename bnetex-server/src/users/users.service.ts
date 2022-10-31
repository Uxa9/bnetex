import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserNotFoundException } from '../exceptions/userNotFound.exception';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TransferMoney } from './dto/transfer-money.dto';
import { User } from './users.model';
import fs from "fs";

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

    async getHistoricalData() {
        const data = {
            "_id": {
                "$oid": "635b7abfbea3729dd1ce42f3"
            },
            "deposit": 1000,
            "enterTime": 1655312220000,
            "enterPrice": 20762.11,
            "avegarePrice": 20682.62089986757,
            "positionType": "LONG",
            "status": false,
            "volume": 0.003384484023514071,
            "volumeUSDT": 70,
            "enterStep": 3,
            "patternEnter": 23,
            "lastEnterPrice": 21256.75,
            "minPrice": 20545.85,
            "positionEnters": [
                {
                    "buyPrice": 20762.11,
                    "avegarePrice": 20762.11,
                    "volume": 0.0009632932298306868,
                    "volumeUSDT": 20,
                    "time": 1655312220000
                },
                {
                    "buyPrice": 20690.64,
                    "avegarePrice": 20726.313388153983,
                    "volumeUSDT": 20,
                    "volume": 0.0009666206555234638,
                    "time": 1655312580000
                },
                {
                    "buyPrice": 20624.65,
                    "avegarePrice": 20682.62089986757,
                    "volumeUSDT": 30,
                    "volume": 0.0014545701381599202,
                    "time": 1655312940000
                }
            ],
            "__v": 0,
            "closePrice": 21256.75,
            "closeTime": 1655315580000,
            "minPricePercent": 0.6612841792620543,
            "percentProfit": 2.7759010954753194,
            "sumProfit": 1.9431307668327236
        }

        const { positionEnters } = data;

        // const data = JSON.parse(a);

        let dates  = [];
        let positionVolume = 0;
        let pnlValues = [];
        let roeValues = [];

        if (data.positionType === "LONG") {
            positionEnters.map((position, index) => {
                if (index === 0) {
                    dates.push(new Date(position.time).toLocaleDateString());
                    pnlValues.push(0);
                    roeValues.push(0);
                    positionVolume+=position.volumeUSDT;                    
                    return;
                }

                const prevPosition = positionEnters[index - 1];
                dates.push(new Date(position.time).toLocaleDateString());
                pnlValues.push(position.avegarePrice / prevPosition.avegarePrice - 1);
                positionVolume+=position.volumeUSDT;
                roeValues.push(positionVolume*pnlValues[index]);

            });

            dates.push(new Date(data.closeTime).toLocaleDateString());
            pnlValues.push(data.percentProfit);
            roeValues.push(data.sumProfit);
        }

        return {
            dates,
            pnlValues,
            roeValues
        }
    }
}
