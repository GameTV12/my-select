import { Controller, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_post')
  createPost(@Payload(ValidationPipe) dto) {
    return this.appService.createPost(dto);
  }

  @MessagePattern('post_create_user')
  createUser(@Payload(ValidationPipe) dto) {
    return this.appService.createUser(dto);
  }

  @MessagePattern('post_update_user')
  updateUser(@Payload(ValidationPipe) dto) {
    return this.appService.updateUser(dto);
  }

  @MessagePattern('update_post')
  updatePost(@Payload(ValidationPipe) { dto, userId, postId }) {
    return this.appService.updatePost(userId, postId, dto);
  }

  @MessagePattern('delete_post')
  deletePost(@Payload(ValidationPipe) { userId, postId }) {
    return this.appService.deletePost(userId, postId);
  }

  @MessagePattern('get_post')
  getPost(@Payload(ValidationPipe) data) {
    return this.appService.getPost(data.id, data.viewerId);
  }

  @MessagePattern('delete_variant')
  deleteVariant(@Payload(ValidationPipe) variantId) {
    return this.appService.deleteVariant(variantId);
  }

  @MessagePattern('post_ban_user')
  banUser(@Payload(ValidationPipe) data) {
    return this.appService.banUser(data);
  }

  @MessagePattern('post_make_moderator')
  makeModerator(@Payload(ValidationPipe) data) {
    return this.appService.makeModerator(data);
  }

  @MessagePattern('post_cancel_moderator')
  cancelModerator(@Payload(ValidationPipe) data) {
    return this.appService.cancelModerator(data);
  }

  @MessagePattern('get_number_posts_of_user')
  getNumberPostOfUser(
    @Payload(ValidationPipe)
    data: string,
  ) {
    return this.appService.getNumberPostsOfUser(data);
  }

  @MessagePattern('get_post_list_of_user')
  getPostListOfUser(@Payload(ValidationPipe) data) {
    return this.appService.getPostListOfUser(data.linkNickname, data.viewerId);
  }

  @MessagePattern('react_on_post')
  reactOnPost(@Payload(ValidationPipe) data) {
    return this.appService.reactOnPost(data.postId, data.userId, data.reaction);
  }

  @MessagePattern('vote_for_post')
  vote(@Payload(ValidationPipe) data) {
    return this.appService.vote(data.variant, data.userId);
  }

  @MessagePattern('add_variant')
  addVariant(@Payload(ValidationPipe) data) {
    return this.appService.addVariant(data.postId, data.userId, data.variant);
  }

  @MessagePattern('get_reaction_info')
  getReactionInfo(@Payload(ValidationPipe) postId: string) {
    return this.appService.getReactionInfo(postId);
  }

  @MessagePattern('get_poll_info')
  getPollInfo(@Payload(ValidationPipe) postId: string) {
    return this.appService.getPollInfo(postId);
  }

  @MessagePattern('get_post_of_followings')
  getPostOfFollowings(@Payload(ValidationPipe) dto) {
    return this.appService.getPostOfFollowings(dto.viewerId, dto.followings);
  }

  @MessagePattern('get_trending_posts')
  getTrendingPosts(@Payload(ValidationPipe) dto) {
    return this.appService.getTrendingPosts(dto.viewerId);
  }

  @MessagePattern('search_posts')
  searchPosts(@Payload(ValidationPipe) dto) {
    return this.appService.searchPosts(dto.args, dto.viewerId);
  }
}
