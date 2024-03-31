import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlobOptions } from 'buffer';
import { UsersModel } from 'src/users/entities/user.entity';
import { HASH_ROUND, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
 
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
     * - 유저의 id 값과 sault를 넣고 암호화하여 access/refresh token 생성
     * - access/refresh token 생성 방식은 동일하므로, 토큰 타입별로 생성하여 중복 제거
     * - access/refresh token을 sign(생성)
     * 
     * 5) retrieveToken
     * - 4번의 signToken 부터 받은 토큰을 반환
     *
     * 6) verifyUserWithEmailAndPassword (2 과정에서 검증 로직)
     * - email 일치하는 사용자 확인
     * - 비밀번호 일치 확인 
     * - 사용자 데이터 반환
     *  
     * 7) verifyToken
     * - access token와 refresh toekn 검증할때 필요한 옵션값으로 검증
     * 
     * 8) access token 재발급
     * - access token 검증 후 유효기간 만료시, 기한 만료 401 반환
     * - refresh token과 함께 access token 재발급 요청
     * - 클라이언트로 부터 받은 refresh token 토큰 검증 성공 후 access token 재발급
     * 
     * 9) refresh token 재발급 (7 과정에서 refresh token도 만료)
     * - refresh token도 만료되었다면, refresh token 재발급 요청 받은 후 생성 및 반환
     */


    /** 
     * 1) signUp: 회원가입
     * - email, password과 함께 요청 받음
     * - access/refresh token 생성
     * - user 생성
     * - access/refresh token 응답 (retrieveToken)
     */
    async signUp(user: Pick<UsersModel, 'email' | 'password'>) {
        // bcrypt.hash : sault 자동 생성
        const hash = await bcrypt.hash(
            user.password,
            HASH_ROUND,
        );

        const newUser = await this.userService.createUser({
            ...user,
            password: hash,
        });

        return this.retrieveToken(newUser); 
    };

    /**
     * 2) signIn : 로그인
     * - email, password과 함께 요청 받고 검증   
     * - access/refresh token 생성 
     * - access/refresh token 응답 (retrieveToken)
     */
    async signIn(user: Pick<UsersModel, 'email' | 'password'>) {
        const existedUser = await this.verifyUserWithEmailAndPassword(user);

        return this.retrieveToken(existedUser); 
    };

    /** 
     * 4) signToken : access/refresh token을 sign (생성)
     * - Payload Info id, password
     * - 1. sub: user's id
     * - 2. type : 'access' | 'refresh'
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

    /**
     * 5) retrieveToken
     * - access/refresh token 별 응답
     * - 4번의 signToken 부터 받은 토큰을 반환
     */
    async retrieveToken(user: Pick<UsersModel, 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true), 
        }
    };

    /** 
     * 6) verifyUserWithEmailAndPassword
     * - email과 password로 유저 검증을 위한 데이터 일치 확인
     * - User 관련 로직이므로, User 비지니스 로직에서 수행하여 검증
     * - 검증 성공: 사용자 데이터 반환
     * - 검증 실패: 이메일 존재 하지 않을시 -> 존재하지 않는 유저 반환 / 패스워드 불일치시 -> 비밀번호 틀렸다고 반환
     * + password: hashing된 값 비교 
     */
    async verifyUserWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
        const existingUser = await this.userService.getUserByEmail(user.email);
        
        if (!existingUser) {
             throw new UnauthorizedException('Not existed user');
        }

        const isPassed = await bcrypt.compare(user.password, existingUser.password);
        
        if(!isPassed) {
            throw new UnauthorizedException('The password is wronged');
        }

        return existingUser;
    };  
}

