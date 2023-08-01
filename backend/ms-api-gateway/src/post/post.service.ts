import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {CreatePostDto} from "../dtos/index.dto";
import {PostCreatedEvent} from "../events/post-created.event";

@Injectable()
export class PostService implements OnModuleInit {
    constructor(@Inject('POST_SERVICE') private readonly postClient: ClientKafka) {
    }

    async getPostById(postId: string) {
        return { id: postId }
    }

    async createPost(createPostDto: CreatePostDto) {
        return this.postClient.send('post_created', new PostCreatedEvent('123', createPostDto))
    }

    async editPost(
        userId: string,
        postId: string,
        dto: CreatePostDto
    ) {

    }

    async deletePost(userId: string, postId: string) {
    }

    async onModuleInit() {
        this.postClient.subscribeToResponseOf('post_created')
        await this.postClient.connect();
    }
}
