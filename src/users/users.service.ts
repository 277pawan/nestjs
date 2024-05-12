import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.models';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs'
import { LoginDto, UserResponse } from './users.dto';  
import { validationSchema } from './users.validation';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ){}
    async findByEmail(useremail: string): Promise<UserDocument | null> {
        console.log("again"+useremail)
        return this.userModel.findOne({ useremail }).exec();
    }
    async CreateUser(user: User): Promise<UserResponse> {
        // check validation of Userdata

        const {error}=validationSchema.validate(user)
        if(error)
            {
                throw new BadRequestException(error.message)
            }
        // Check if user already exists
        const existingUser = await this.userModel.findOne({ useremail: user.useremail }).exec();
        if (existingUser) {
            throw new ConflictException('User email already exists');
        }
        const hashedPassword= await bcrypt.hash(user.userpassword,10)

        const newUser = new this.userModel({...user,userpassword:hashedPassword});
        await newUser.save();
        const token = this.jwtService.sign({ userId: newUser._id })
        return { message: 'Account created successfully', user: newUser.toObject(),token:token};
    }

    async validateUser(useremail:string,userpassword:string):Promise<any>{
        const user=await this.userModel.findOne({useremail:useremail});
        if(user && await bcrypt.compare(userpassword,user.userpassword))
            {
         return user;
    }

    return null;
    }

    async login(LoginDto:LoginDto):Promise<UserResponse>{
        const user=await this.validateUser(LoginDto.useremail,LoginDto.userpassword)
        if (!user) {
            throw new UnauthorizedException('Invalid credentials(Email and Password)');
        }
        const token = this.jwtService.sign({ userId: user._id });
        return {message:"Login Successfull",user:user.toObject(),token:token };
    
    }
}
