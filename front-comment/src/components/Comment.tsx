import React, {FC, useEffect, useState} from 'react'
import {
    Avatar,
    Box,
    Grid,
    IconButton,
    Link,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material"
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined'
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import LinearProgress from '@mui/material/LinearProgress'
import millify from "millify"
import ReactionComponent from "./ReactionComponent";
import Tooltip from "@mui/material/Tooltip"
import FlagIcon from '@mui/icons-material/Flag'
import ReplyIcon from '@mui/icons-material/Reply'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import DeleteCommentModal from "./DeleteCommentModal";
import ReportCommentModal from "./ReportCommentModal";

export type CommentType = {
    id: string
    nickname: string
    linkNickname: string
    userId: string
    image: string
    text: string
    replyTo?: string
    replyText?: string
    replyNickname?: string
    time: number
    likes: number
    dislikes: number
    status: LikeStatus
    deleteComment?: (commentId: string) => void
}

export enum LikeStatus {
    LIKED = 'LIKED',
    DISLIKED = 'DISLIKED',
    NONE = 'NONE'
}

const Comment: FC<CommentType> = ({
                                      id,
                                      nickname,
                                      linkNickname,
                                      userId,
                                      image,
                                      text,
                                      replyTo,
                                      replyText,
                                      replyNickname,
                                      time,
                                      status,
                                      likes,
                                      dislikes,
                                      deleteComment
                                  }: CommentType) => {
    const [likesNumber, setLikesNumber] = useState<number>(likes)
    const [dislikesNumber, setDislikesNumber] = useState<number>(dislikes)
    const [currentStatus, setCurrentStatus] = useState<LikeStatus>(status)
    const [auth, setAuth] = useState<boolean>(true)
    const [progressNumber, setProgressNumber] = useState(0)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [reportModal, setReportModal] = useState<boolean>(false)

    useEffect(() => {
        if (likesNumber + dislikesNumber) setProgressNumber(100 * likesNumber / (likesNumber + dislikesNumber))
        else setProgressNumber(50)
    }, [likesNumber, dislikesNumber])

    // если чел лайкает, и не зареган, то ему дастся модальное окно на вход, которое я импортирую с микрофронта юзера
    function handleLike() {
        if (auth) {
            if (currentStatus == LikeStatus.DISLIKED) {
                setDislikesNumber((prevState) => prevState - 1)
                setLikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.LIKED)
            } else if (currentStatus == LikeStatus.LIKED) {
                setLikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.NONE)
            } else {
                setLikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.LIKED)
            }
        }
    }

    function handleDislike() {
        if (auth) {
            if (currentStatus == LikeStatus.LIKED) {
                setDislikesNumber((prevState) => prevState + 1)
                setLikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.DISLIKED)
            } else if (currentStatus == LikeStatus.DISLIKED) {
                setDislikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.NONE)
            } else {
                setDislikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.DISLIKED)
            }
        }
    }

    function handleDeleteModalClickOpen() {
        setDeleteModal(true)
    }

    function handleDeleteModalClose() {
        setDeleteModal(false)
    }

    function handleReportModalClickOpen() {
        setReportModal(true)
    }

    function handleReportModalClose() {
        setReportModal(false)
    }

    return (
        <ListItem alignItems="flex-start" sx={{boxShadow: 1, mb: 4, p: 3, pr: 4, pt: 2}}>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={image}/>
            </ListItemAvatar>
            <ListItemText
                primary={<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box>
                        <Link href={"https://leetcode.com/"} target={"_blank"} underline="none">{nickname}</Link>
                        <em>&nbsp;{new Date(time).getDate()}.{new Date(time).getMonth() + 1}.{new Date(time).getFullYear()} {new Date(time).getHours()}:{new Date(time).getMinutes()}</em>
                    </Box>
                    <Box>
                        {/*<IconButton onClick={handleReportModalClickOpen}><FlagIcon /></IconButton>*/}
                        <IconButton onClick={handleDeleteModalClickOpen}><CancelPresentationIcon /></IconButton>
                    </Box>
                </Box>}
                secondary={
                    <>
                        {replyTo &&
                            <Box>
                                <Typography
                                    component="div"
                                    variant="body2"
                                    color="text.primary"
                                    align="justify"
                                    sx={{display: "flex", alignItems: "center"}}
                                >
                                    <ReplyIcon/>&nbsp;{replyNickname}
                                </Typography>
                                <Typography
                                    component="div"
                                    variant="caption"
                                    color="text.secondary"
                                    align="justify"
                                    sx={{
                                        whiteSpace: 'pre-line',
                                        textIndent: '10px',
                                        mb: 1,
                                        fontStyle: 'oblique',
                                        WebkitLineClamp: 2,
                                        display: "-webkit-box",
                                        px: 1,
                                        overflow: "hidden",
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {replyText}
                                </Typography>
                            </Box>
                        }
                        <Typography
                            component="div"
                            variant="body2"
                            color="text.primary"
                            align="justify"
                            sx={{whiteSpace: 'pre-line', textIndent: '10px', mt: 0.5}}
                        >
                            {text}
                        </Typography>
                        <Grid container sx={{
                            p: 1,
                            bgcolor: 'background.paper',
                        }}>
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                                <ListItem sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                    <ListItem><ReactionComponent numberOfReaction={likesNumber}
                                                                 handleReaction={handleLike} status={currentStatus}
                                                                 type={"like"}/></ListItem>
                                    <ListItem><ReactionComponent numberOfReaction={dislikesNumber}
                                                                 handleReaction={handleDislike} status={currentStatus}
                                                                 type={"dislike"}/></ListItem>
                                </ListItem>
                                <Tooltip title={`${likesNumber} / ${dislikesNumber}`}><LinearProgress
                                    variant="determinate" value={progressNumber}/></Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8} lg={9} xl={9}
                                  sx={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',
                                      alignItems: 'center'
                                  }}>
                                <ListItem sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                        sx={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Reply
                                    </Typography>
                                </ListItem>
                            </Grid>
                        </Grid>
                    </>
                }
            />
            {deleteComment && <DeleteCommentModal open={deleteModal} onClose={handleDeleteModalClose} commentId={id} deleteComment={deleteComment}/>}
            <ReportCommentModal open={reportModal} onClose={handleReportModalClose} user={userId} />
        </ListItem>
    );
};

export default Comment;