import React, {useState} from 'react';
import {Avatar, Link, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";

export type Comment = {
    id: string
    nickname: string
    linkNickname: string
    image: string
    text: string
    repliedTo?: string
    time: number
    likes: number
    dislikes: number
    status: LikeStatus
}

enum LikeStatus {
    LIKED = 'LIKED',
    DISLIKED = 'DISLIKED',
    NONE = 'NONE'
}
const Comment = ({id, nickname, linkNickname, image, text, repliedTo, time, status, likes, dislikes} : Comment) => {
    const [likesNumber, setLikesNumber] = useState<number>(likes)
    const [dislikesNumber, setDislikesNumber] = useState<number>(dislikes)
    const [currentStatus, setCurrentStatus] = useState<LikeStatus>(status)
    const [auth, setAuth] = useState<boolean>(true)
    // если чел лайкает, и не зареган, то ему дастся модальное окно на вход, которое я импортирую с микрофронта юзера
    function handleLike() {
        if (auth) {
            if (currentStatus == LikeStatus.DISLIKED) {
                setDislikesNumber((prevState) => prevState-1)
                setLikesNumber((prevState) => prevState+1)
                setCurrentStatus(LikeStatus.LIKED)
            }
            else if (currentStatus == LikeStatus.LIKED) {
                setLikesNumber((prevState) => prevState-1)
                setCurrentStatus(LikeStatus.NONE)
            }
            else {
                setLikesNumber((prevState) => prevState+1)
                setCurrentStatus(LikeStatus.LIKED)
            }
        }
    }

    function handleDislike() {
        if (auth) {
            if (currentStatus == LikeStatus.LIKED) {
                setDislikesNumber((prevState) => prevState+1)
                setLikesNumber((prevState) => prevState-1)
                setCurrentStatus(LikeStatus.DISLIKED)
            }
            else if (currentStatus == LikeStatus.DISLIKED) {
                setDislikesNumber((prevState) => prevState-1)
                setCurrentStatus(LikeStatus.NONE)
            }
            else {
                setDislikesNumber((prevState) => prevState+1)
                setCurrentStatus(LikeStatus.DISLIKED)
            }
        }
    }

    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={image} />
            </ListItemAvatar>
            <ListItemText
                primary={<><Link href={"https://leetcode.com/"} target={"_blank"} underline="none">{nickname}</Link> <em>{new Date(time).getDate()}.{new Date(time).getMonth()+1}.{new Date(time).getFullYear()}  {new Date(time).getHours()}:{new Date(time).getMinutes()}</em></>}
                secondary={
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {text}
                        </Typography>
                }
            />
            <div>Likes: {likesNumber}</div>
            <div>Dislikes: {dislikesNumber}</div>
        </ListItem>
    );
};

export default Comment;