import { ApiProperty } from "@nestjs/swagger";


export class PasswordChangedSuccess {
    @ApiProperty({
        example: "SUCCESS"
    })
    status: string;

    @ApiProperty({
        example: "PASSWORD_CHANGED"
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