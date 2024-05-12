import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://nestjs:RRxm2hkRsIhY3uiD@cluster0.kntn6y9.mongodb.net/"),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
