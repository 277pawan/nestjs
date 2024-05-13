// users.controller.ts

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.models';
import { LoginDto, UserResponse } from './users.dto'; // Import UserResponse interface
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
    async CreateUser(@Body() userDto: User): Promise<UserResponse> {
        return this.userService.CreateUser(userDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return this.userService.login(loginDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // This route should not have any logic,
        // as the actual authentication is handled by Passport.js middleware.
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        // After successful authentication, the user will be redirected here.
        // You can handle the user data from the request object (req.user).
        const user = req.user;
        if (!user) {
            // Handle error, user not found
            return null;
        }

        // Check if the user's email exists in the database
        const existingUser = await this.userService.CheckerEmail(user.email);

        if (existingUser) {
            // User exists, log in with refresh token
            // Implement your login logic here
            return this.userService.googlelogin(existingUser);
        } else {
            // User does not exist, create a new account
            return this.userService.CreateUser(user);
        }
    }
}
