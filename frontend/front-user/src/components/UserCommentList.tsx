import React, {Suspense, useEffect, useState} from 'react';
import {List} from "@mui/material"
import {Navigate, useParams} from "react-router-dom";
import { getAllCommentsOfUser } from "../utils/publicRequests";
import {useCookies} from "react-cookie";
import {UserI} from "../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {getAllCommentsOfUserAuth} from "../utils/authRequests";
// @ts-ignore
const Comment = React.lazy(() => import('front_comment/Comment'))

export enum UserRole {
    DEFAULT_USER,
    ADMIN,
    MODERATOR,
}

export enum LikeStatus {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
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
    createdAt: Date
    status?: LikeStatus
}

export const UserCommentList = () => {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

    const { id } = useParams()

    useEffect(() => {
        if (id != undefined) {
            if (currentUser) {
                getAllCommentsOfUserAuth(id).then(r => {setCommentList(r)}).catch(r => {
                    return <Navigate replace to={'/'} />
                })
            }
            else {
                getAllCommentsOfUser(id).then(r => {setCommentList(r)}).catch(r => {
                    return <Navigate replace to={'/'} />
                })
            }
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
                             status={currentUser && comment.status ? comment.status : LikeStatus.NONE}
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