import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlobOptions } from 'buffer';
import { UsersModel } from 'src/users/entities/user.entity';
import { JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
    ){}
    /**
     * 1) signUp
     * - email, password과 함께 요청 받음
     * - access/refresh token 생성 및 유저 생성
     * - access/refresh token 응답 
     * 
     * 2) signIn
     * - email, password과 함께 요청 받고 검증
     * - access/refresh token 생성 및 응답
     * 
     * 3) signOut
     * - 클라이언트에서 token 무효화를 위해, access/refresh token 삭제
     * 
     * 4) signToken (1, 2번의 access/refresh token 생성)
     *  - access/refresh token을 sign(생성)
     *
     * 5) verifyUser (2 과정에서 검증 로직)
     * - email 일치하는 사용자 확인
     * - 비밀번호 일치 확인 
     * - 사용자 데이터 반환
     *  
     * 6) verifyToken
     * - access token와 검증할때 필요한 옵션값으로 검증
     * 
     * 7) access token 재발급
     * - access token 검증 후 유효기간 만료시, 기한 만료 401 반환
     * - refresh token과 함께 access token 재발급 요청
     * - 클라이언트로 부터 받은 refresh token 토큰 검증 성공 후 access token 재발급
     * 
     * 8) refresh token 재발급 (5 과정에서 refresh token도 만료)
     * - 5에서 refresh token도 만료되었다면, refresh token 재발급 요청 받은 후 생성 및 반환
     */


    /**
     * email과 password로 유저 검증을 위한 데이터 일치 확인
     * User 관련 로직이므로, User 비지니스 로직에서 수행하여 검증
     * + password: hash
     */
    verifyUserWithEmailAndPassword() {
        
    }; 


    async signIn(user: Pick<UsersModel, 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true), 
        }
    };

    /** 
     * 4) signToken : access/refresh token을 sign (생성)
     * 
     * Payload Info id, password
     * 1. sub: user's id
     * 2. type : 'access' | 'refresh'
     * 
     * + Pick Utility Type: Utility를 사용하여 UserModel에서 id를 사용한다고 명시를 통해 가독성 향상
     */
    signToken(user: Pick<UsersModel, 'id'>, isRefreshToken: boolean) { 
         const Payload = {
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
         };

         return this.jwtService.sign(Payload, {
            secret: JWT_SECRET,
            expiresIn: isRefreshToken ? 3600 : 360,
         })
    }
}

