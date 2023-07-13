import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box, Grid,
    IconButton, ImageList, ImageListItem, LinearProgress,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material"
import FlagIcon from '@mui/icons-material/Flag'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import ReactionComponent from "./ReactionComponent"
import CommentIcon from '@mui/icons-material/Comment'
import ReportPostModal from "./ReportPostModal"
import DeletePostModal from "./DeletePostModal"
import ImageBlock from "./ImageBlock"
import YouTube from "react-youtube"
import PollBlock from "./PollBlock"
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddNewVariantModal, {VariantMessage} from "./AddNewVariantModal"
import {Link} from "react-router-dom"

export interface Variant {
    id: string
    title: string
    votes: number
}

export interface PostData {
    id: string
    userId: string
    nickname: string
    linkNickname: string
    userPhoto: string
    title: string
    text: string
    photos?: string[]
    video?: string
    commentsAllowed: boolean
    variantsAllowed?: boolean
    variants?: Variant[]
    isVoted?: boolean
    createdAt: number
    updatedAt: number
    likes: number
    dislikes: number
    status: LikeStatus
    fullPost?: boolean
    deletePost?: (postId: string) => void
}

export enum LikeStatus {
    LIKED = 'LIKED',
    DISLIKED = 'DISLIKED',
    NONE = 'NONE'
}

const Post = ({
                  id,
                  userId,
                  nickname,
                  linkNickname,
                  userPhoto,
                  title,
                  text,
                  photos,
                  video,
                  commentsAllowed,
                  variantsAllowed,
                  variants,
                  isVoted,
                  createdAt,
                  updatedAt,
                  likes,
                  dislikes,
                  status,
                  fullPost,
                  deletePost
              }: PostData) => {
    const [likesNumber, setLikesNumber] = useState<number>(likes)
    const [dislikesNumber, setDislikesNumber] = useState<number>(dislikes)
    const [currentStatus, setCurrentStatus] = useState<LikeStatus>(status)
    const [auth, setAuth] = useState<boolean>(true)
    const [progressNumber, setProgressNumber] = useState(0)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [reportModal, setReportModal] = useState<boolean>(false)
    const [variantList, setVariantList] = useState<Variant[]>(variants ? variants : [])
    const [votedStatus, setVotedStatus] = useState<boolean | undefined>(isVoted!=undefined ? isVoted : undefined)
    const [variantModal, setVariantModal] = useState(false)

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

    function handleAddNewVariantModalClickOpen() {
        setVariantModal(true)
    }

    function handleAddNewVariantModalClose() {
        setVariantModal(false)
    }

    function addNewVariant({id, text}: VariantMessage) {
        setVotedStatus(true)
        setVariantList(prevState => ([...prevState, {id: id, title: text, votes: 1}]))
    }

    function voteForVariant(variantId: string) {
        if (variants != undefined) {
            const newList = variantList.map(variant => {
                if (variant.id == variantId) {
                    return {title: variant.title, votes: variant.votes+1, id: variant.id}
                }
                return variant
            })
            setVariantList(newList)
            setVotedStatus(true)
        }
    }

    return (
        <ListItem alignItems="flex-start" sx={{boxShadow: 5, mb: 4, p: 3, pr: 4, pt: 2}}>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={userPhoto}/>
            </ListItemAvatar>
            <ListItemText
                primary={<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box>
                        <Link to={"https://leetcode.com/"} target={"_blank"} style={{ "display": "none" }}>{nickname}</Link>
                        <em>&nbsp;{new Date(createdAt).getDate()}.{new Date(createdAt).getMonth() + 1}.{new Date(createdAt).getFullYear()} {String(new Date(createdAt).getHours()).padStart(2, '0')}:{String(new Date(createdAt).getMinutes()).padStart(2, '0')}</em>
                    </Box>
                    <Box>
                        <Tooltip title={"Report"}><IconButton
                            onClick={handleReportModalClickOpen}><FlagIcon/></IconButton></Tooltip>
                        {deletePost && <Tooltip title={"Delete"}><IconButton
                            onClick={handleDeleteModalClickOpen}><CancelPresentationIcon/></IconButton></Tooltip>
                        }
                        {variants != undefined && votedStatus != undefined && !votedStatus && variantsAllowed && <Tooltip title={"Add a new variant"}><IconButton onClick={handleAddNewVariantModalClickOpen}><AddBoxIcon /></IconButton></Tooltip>}
                    </Box>
                </Box>}
                secondary={
                    <>
                        <Typography variant="h5" component="h5" align="center" color="text.primary">
                            {title}
                        </Typography>
                        <Typography
                            component="div"
                            variant="body2"
                            color="text.primary"
                            align="justify"
                            sx={{whiteSpace: 'pre-line', mt: 0.5, textIndent: 10}}
                        >
                            {text}
                        </Typography>
                        {photos && <Box sx={{mt: 2}}><ImageBlock images={photos}/></Box>}
                        {video && <Box sx={{mt: 2}}><YouTube videoId={video} opts={{width: '100%'}}/></Box>}
                        {variants && <Box sx={{mt: 2}}><PollBlock postId={id} fullPost={fullPost} variants={variantList} isVoted={votedStatus} voteForVariant={votedStatus==false ? voteForVariant : (variantId: string)=> false }/></Box>}
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
                            {commentsAllowed && <Grid item xs={12} sm={6} md={8} lg={9} xl={9}
                                                      sx={{
                                                          display: 'flex',
                                                          flexDirection: 'row',
                                                          justifyContent: 'flex-end',
                                                          alignItems: 'center'
                                                      }}>
                                <Typography
                                    component="div"
                                    variant="body2"
                                    color="text.primary"
                                    sx={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        py: 2
                                    }}
                                >
                                    <Link to={`/posts/${id}/comments`}><CommentIcon /></Link>
                                </Typography>
                            </Grid>
                            }
                        </Grid>
                    </>
                }
            />
            {deletePost && <DeletePostModal open={deleteModal} onClose={handleDeleteModalClose} commentId={id}
                                            deletePost={deletePost}/>}
            <ReportPostModal open={reportModal} onClose={handleReportModalClose} user={userId}/>
            <AddNewVariantModal open={variantModal} onClose={handleAddNewVariantModalClose} addVariant={addNewVariant} />
        </ListItem>
    );
};

export default Post;