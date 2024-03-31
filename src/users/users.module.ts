import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';

@Module({
  imports: [ // 생성한 Modules을 import
    TypeOrmModule.forFeature([ // Model에 해당되는 Repository Injection
      UsersModel, 
    ]) 
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
