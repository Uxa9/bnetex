import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { InternalServerError } from 'src/exceptions/internalError.exception';
import { RoleDoubleFound } from 'src/exceptions/role/roleDouble.exception';

@Injectable()
export class RolesService {
    
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto : CreateRoleDto) {
        try {
            const roleDouble = await this.roleRepository.findOne({ where : { name: dto.name } });
            if ( roleDouble ) throw "DOUBLE";

            const role = await this.roleRepository.create(dto);
            return role;
        } catch (error) {
            if (error === "DOUBLE") throw new RoleDoubleFound;
            else throw new InternalServerError;
        }
    }

    async getRoleByName(name : string) {
        console.log(name);
        
        try {
            const role = await this.roleRepository.findOne({ where : { id: 1 }});
            
            return role;
        } catch (error) {
            throw new InternalServerError;   
        }        
    }
}
