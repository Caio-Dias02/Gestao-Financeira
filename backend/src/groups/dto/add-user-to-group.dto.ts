import { IsUUID, IsEnum } from 'class-validator';

export enum GroupRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class AddUserToGroupDto {
  @IsUUID()
  userId: string;

  @IsEnum(GroupRole)
  role: GroupRole = GroupRole.MEMBER;
}
