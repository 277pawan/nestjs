import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.models';
import { LoginDto, UserResponse } from './users.dto'; // Import UserResponse interface

@Controller('users')
export class UsersController {
    constructor(private readonly UserService:UsersService)
    {}
    @Post()
        async CreateUser(@Body() userDto:User):Promise<UserResponse>{
            return this.UserService.CreateUser(userDto)
        }
        @Post('login')
        async login(@Body() loginDto: LoginDto): Promise<any> {
            return this.UserService.login(loginDto);
        }
    
}

