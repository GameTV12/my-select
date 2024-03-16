import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export enum Decision {
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
  WAITING = 'WAITING',
}

export class DecideRequestsDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  requestId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  adminId: string;

  @IsNotEmpty()
  @IsEnum(Decision)
  decision: Decision;
}
