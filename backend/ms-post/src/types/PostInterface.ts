import { UserRole } from '@prisma/client';

export interface PostInterface {
  id: string;
  title: string;
  text: string;
  video?: string;
  variantsAllowed?: boolean;
  commentsAllowed: boolean;
  Variants?: any[];
  Photo?: any[];
  user?: {
    userId: string;
    nickname: string;
    linkNickname: string;
    photo: string;
    role: UserRole;
    secondVerification: boolean;
  };
  _count: {
    Reaction: number;
  };
}
