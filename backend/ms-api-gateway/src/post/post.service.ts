import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreatePostDto } from '../dtos';
import { ReactionType } from '../comment/comment.service';

@Injectable()
export class PostService implements OnModuleInit {
  constructor(
    @Inject('POST_SERVICE') private readonly postClient: ClientKafka,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  async createPost(userId: string, dto: CreatePostDto) {
    const newPostDto = {
      ...dto,
      userId,
    };
    const post = await new Promise((resolve) => {
      this.postClient.send('create_post', newPostDto).subscribe((data) => {
        resolve(data);
      });
    });
    return post;
  }

  async getPostById(postId: string, viewerId?: string) {
    const post = await new Promise((resolve) => {
      this.postClient
        .send('get_post', { id: postId, viewerId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return post;
  }

  async updatePost(userId: string, postId: string, dto: CreatePostDto) {
    const post = await new Promise((resolve) => {
      this.postClient
        .send('update_post', {
          dto: { ...dto, userId: userId },
          userId: userId,
          postId: postId,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return post;
  }

  async deletePost(userId: string, postId: string) {
    const post = await new Promise((resolve) => {
      this.postClient
        .send('delete_post', { userId, postId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return post;
  }

  async deleteVariant(variantId) {
    await new Promise((resolve) => {
      this.postClient.send('delete_variant', variantId).subscribe((data) => {
        resolve(data);
      });
    });
    return true;
  }

  async getPostListOfUser(link, viewerId?) {
    const posts = await new Promise((resolve) => {
      this.postClient
        .send('get_post_list_of_user', {
          linkNickname: link,
          viewerId: viewerId,
        })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return posts;
  }

  async reactOnPost(postId: string, userId: string, reaction: ReactionType) {
    const post = await new Promise((resolve) => {
      this.postClient
        .send('react_on_post', { postId, userId, reaction })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return post;
  }

  async voteForPost(variant: string, userId: string) {
    const post = await new Promise((resolve) => {
      this.postClient
        .send('vote_for_post', { variant, userId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return post;
  }

  async addVariant(variant: string, userId: string, postId: string) {
    const post = await new Promise((resolve) => {
      this.postClient
        .send('add_variant', { variant, userId, postId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return post;
  }

  async getPostOfFollowings(viewerId: string) {
    const followingsData = await new Promise((resolve) => {
      this.userClient
        .send('get_full_followings', { viewerId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    let followings: string[] = [];
    if (followingsData instanceof Array) {
      followings = followingsData.map((item) => item.followers);
    }
    const posts = await new Promise((resolve) => {
      this.postClient
        .send('get_post_of_followings', { viewerId, followings })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return posts;
  }

  async getTrendingPosts(viewerId?: string) {
    const posts = await new Promise((resolve) => {
      this.postClient
        .send('get_trending_posts', viewerId ? { viewerId } : {})
        .subscribe((data) => {
          resolve(data);
        });
    });
    return posts;
  }

  async searchPosts(args: string, viewerId?: string) {
    const posts = await new Promise((resolve) => {
      this.postClient
        .send('search_posts', { args, viewerId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return posts;
  }

  async onModuleInit() {
    this.postClient.subscribeToResponseOf('create_post');
    this.postClient.subscribeToResponseOf('post_create_user');
    this.postClient.subscribeToResponseOf('post_update_user');
    this.postClient.subscribeToResponseOf('post_ban_user');
    this.postClient.subscribeToResponseOf('post_make_moderator');
    this.postClient.subscribeToResponseOf('post_cancel_moderator');
    this.postClient.subscribeToResponseOf('update_post');
    this.postClient.subscribeToResponseOf('delete_post');
    this.postClient.subscribeToResponseOf('get_post');
    this.postClient.subscribeToResponseOf('delete_variant');
    this.postClient.subscribeToResponseOf('get_number_posts_of_user');
    this.postClient.subscribeToResponseOf('get_post_list_of_user');
    this.postClient.subscribeToResponseOf('react_on_post');
    this.postClient.subscribeToResponseOf('vote_for_post');
    this.postClient.subscribeToResponseOf('add_variant');
    this.postClient.subscribeToResponseOf('get_reaction_info');
    this.postClient.subscribeToResponseOf('get_poll_info');
    this.postClient.subscribeToResponseOf('get_post_of_followings');
    this.postClient.subscribeToResponseOf('get_trending_posts');
    this.postClient.subscribeToResponseOf('search_posts');
    await this.postClient.connect();
  }
}
