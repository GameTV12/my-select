import React, {Suspense, useState} from 'react';
import {Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material"
import {allComments} from "../mockData/mockComments";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import SouthIcon from '@mui/icons-material/South'
import NorthIcon from '@mui/icons-material/North'
// @ts-ignore
const Comment = React.lazy(() => import('front_comment/Comment'))
export const ListComment = () => {
    const [commentList, setCommentList] = useState(allComments);

    function deleteComment(commentId: string) {
        setCommentList(commentList.filter((comment) => comment.id != commentId))
    }

    return (
        <List sx={{bgcolor: 'background.paper'}}>
            {commentList.sort((item1, item2) => item2.time - item1.time).map((comment) => {
                return (<Suspense fallback={<div>Loading...</div>}>
                    <Comment key={comment.id} id={comment.id} nickname={comment.nickname}
                             linkNickname={comment.linkNickname}
                             image={comment.image} text={comment.text} time={comment.time} status={comment.status}
                             userId={comment.userId}
                             repliedTo={comment.repliedTo} repliedText={comment.repliedText}
                             repliedNickname={comment.repliedNickname} deleteComment={deleteComment}
                             likes={comment.likes} dislikes={comment.dislikes}/>
                </Suspense>)
            })}
        </List>
    );
};

export default ListComment;