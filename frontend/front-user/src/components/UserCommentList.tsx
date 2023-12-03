import React, {Suspense, useEffect, useState} from 'react';
import {List} from "@mui/material"
import {Navigate, useParams} from "react-router-dom";
import { getAllCommentsOfUser } from "../utils/publicRequests";
// @ts-ignore
const Comment = React.lazy(() => import('front_comment/Comment'))

export enum UserRole {
    DEFAULT_USER,
    ADMIN,
    MODERATOR,
}

export enum LikeStatus {
    LIKED = 'LIKED',
    DISLIKED = 'DISLIKED',
    NONE = 'NONE'
}

export interface CommentInterface {
    id: string;
    text: string;
    reply?: {
        id: string;
        text: string;
        user: {
            nickname: string
        }
    } | null;
    user: {
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
    likes: number
    dislikes: number
    createdAt: Date;
}

export const UserCommentList = () => {
    const { id } = useParams()

    useEffect(() => {
        if (id != undefined) {
            getAllCommentsOfUser(id).then(r => {setCommentList(r)}).catch(r => {
                return <Navigate replace to={'/'} />
            })
        }
    }, [id]);

    const [commentList, setCommentList] = useState<CommentInterface[]>([]);

    function deleteComment(commentId: string) {
        setCommentList(commentList.filter((comment) => comment.id != commentId))
    }

    return (
        <List sx={{bgcolor: 'background.paper'}}>
            {commentList.sort((item1, item2) => new Date(item2.createdAt).getTime() - new Date(item1.createdAt).getTime()).map((comment) => {
                return (<Suspense fallback={<div>Loading...</div>}>
                    <Comment key={comment.id} id={comment.id} nickname={comment.user.nickname}
                             linkNickname={comment.user.linkNickname}
                             image={comment.user.photo} text={comment.text} time={new Date(comment.createdAt).getTime()}
                             status={LikeStatus.NONE}// for unauthorized users
                             userId={comment.user.id}
                             repliedTo={comment.reply?.id} repliedText={comment.reply?.text}
                             repliedNickname={comment.reply?.user.nickname} deleteComment={deleteComment}
                             likes={comment.likes} dislikes={comment.dislikes}/>
                </Suspense>)
            })}
        </List>
    );
};

export default UserCommentList;