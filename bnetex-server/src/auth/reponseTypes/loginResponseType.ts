import { ApiProperty } from "@nestjs/swagger";


export class LoginResponseSuccess {
    @ApiProperty({
        example: "SUCCESS"
    })
    status: string;

    @ApiProperty({
        example: "LOGIN_SUCCESS"
    })
    message: string;
    
    @ApiProperty({
        example: 228
    })
    userId: number;
    
    @ApiProperty({
        example: "aboba.aboba.aboba"
    })
    token: string;
}