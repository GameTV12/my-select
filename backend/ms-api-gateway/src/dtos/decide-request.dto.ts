import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Decision {
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
  WAITING = 'WAITING',
}

export class DecideRequestsDto {
  @ApiProperty({
    description: 'Request id',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  requestId: string;

  @ApiProperty({
    description: 'Id of admin after decision',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  adminId: string;

  @ApiProperty({
    description: 'Decision',
    example: 'ACCEPTED',
  })
  @IsNotEmpty()
  @IsEnum(Decision)
  decision: Decision;
}
