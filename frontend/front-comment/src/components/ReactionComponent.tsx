import React, {FC} from 'react';
import {LikeStatus} from "./Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import millify from "millify";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import Tooltip from "@mui/material/Tooltip";

type ReactionType = {
    numberOfReaction: number
    handleReaction: () => void
    status: LikeStatus
    type: string
}
const ReactionComponent: FC<ReactionType> = ({numberOfReaction, handleReaction, status, type}: ReactionType) => {
    return <>
        {type == "like" && <>{status == LikeStatus.LIKED ? <><ThumbUpIcon onClick={handleReaction} sx={{ cursor: 'pointer' }}/>&nbsp;&nbsp;<Tooltip title={"dsafsdf"}><strong>{millify(numberOfReaction)}</strong></Tooltip></> : <><ThumbUpOffAltOutlinedIcon sx={{ cursor: 'pointer' }} onClick={handleReaction}/>&nbsp;&nbsp;{millify(numberOfReaction)}</>}</>}
        {type == "dislike" && <>{status == LikeStatus.DISLIKED ? <><ThumbDownIcon onClick={handleReaction} sx={{ cursor: 'pointer' }}/>&nbsp;&nbsp;<strong>{millify(numberOfReaction)}</strong></> : <><ThumbDownOffAltOutlinedIcon sx={{ cursor: 'pointer' }} onClick={handleReaction}/>&nbsp;&nbsp;{millify(numberOfReaction)}</>}</>}
    </>
};

export default ReactionComponent;