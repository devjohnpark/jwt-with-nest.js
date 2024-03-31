import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './users/entities/user.entity';

@Module({
  imports: [UsersModule, 
    AuthModule, 
    TypeOrmModule.forRoot({ // Nest.js와 TypeOrm 연동 (Nest.js의 최상위 모듈인 app.modules.ts와 TypeORM를 연동)
      // DB Type
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'qkrwnstj13@$',
      database: 'postgres',
      entities: [UsersModel], // DB Models
      synchronize: true, // nest.js에서 typeorm으로 생성한 데이터와 DB를 자동 동기화
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
