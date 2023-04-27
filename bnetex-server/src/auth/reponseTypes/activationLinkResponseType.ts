import { ApiProperty } from "@nestjs/swagger";


export class ActivationLinkSuccess {
    @ApiProperty({
        example: "2077-01-01T12:00:00.000Z"
    })
    linkTimestamp: Date;
}