import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostDto } from '../dtos/post.dto';

export class PostCreatedEvent {
  constructor(
    public readonly postId: string,
    public readonly createPostDto: PostDto,
  ) {}

  public toString() {
    return JSON.stringify({
      id: this.postId,
      userId: this.createPostDto.userId,
      title: this.createPostDto.title,
      text: this.createPostDto.text,
      commentsAllowed: this.createPostDto.commentsAllowed,
      photos: this.createPostDto.photos,
      video: this.createPostDto.video,
      variantsAllowed: this.createPostDto.variantsAllowed,
      variants: this.createPostDto.variants,
    });
  }
}
