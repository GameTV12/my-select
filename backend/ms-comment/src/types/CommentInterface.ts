import { UserRole } from '@prisma/client';

export interface CommentInterface {
  id: string;
  text: string;
  reply?: {
    id: string;
    text: string;
  };
  user?: {
    id: string;
    nickname: string;
    linkNickname: string;
    photo: string;
    role: UserRole;
    secondVerification: boolean;
  };
  _count: {
    Reaction: number;
  };
  createdAt: Date;
}
