import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    /**
     * 1) signUpWithEmail
     * - email, password과 함께 요청 받고 access/refresh token 생성 및 유저 생성
     * - access/refresh token 응답  
     * 
     * 2) signInWithEmail
     * - email, password과 함께 요청 받고 검증
     * - access/refresh token 생성 및 응답
     * 
     * 3) signOut
     * - 클라이언트에서 token 무효화를 위해, access/refresh token 삭제
     * 
     * 4) signToken 
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
}

