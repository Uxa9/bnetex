import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber, Max, Min } from "class-validator";

export class GetPositionsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  readonly monthsNumber: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  readonly amount: number;
}