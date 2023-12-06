import React, {useEffect, useRef, useState} from 'react';
import {
    Avatar,
    Box,
    ClickAwayListener,
    Grid,
    Grow,
    IconButton,
    LinearProgress,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Tooltip,
    Typography
} from "@mui/material"
import ReactionComponent from "./ReactionComponent"
import CommentIcon from '@mui/icons-material/Comment'
import ReportPostModal from "./ReportPostModal"
import DeletePostModal from "./DeletePostModal"
import ImageBlock from "./ImageBlock"
import YouTube from "react-youtube"
import PollBlock from "./PollBlock"
import AddNewVariantModal, {VariantMessage} from "./AddNewVariantModal"
import {Link} from "react-router-dom"
import {useCookies} from "react-cookie";
import {UserI} from "../../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {dislikePostRequest, likePostRequest, voteForVariantRequest} from "../../utils/authRequest";

export interface Variant {
    id: string,
    text: string,
    votes: number,
    postId: string
}

export interface Photo {
    id: string
    link: string
    postId: string
}

export enum Role {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    DEFAULT_USER = "DEFAULT_USER"
}

export interface PostInterface {
    id: string
    title: string
    user: {
        userId: string
        nickname: string
        linkNickname: string
        photo: string
        role: Role
        secondVerification: boolean
    }
    text: string
    Photo?: Photo[]
    video?: string
    commentsAllowed: boolean
    variantsAllowed?: boolean
    Variants?: Variant[]
    isVoted?: boolean
    createdAt: Date
    _count?: {
        Reaction: number
    }
    likes: number
    dislikes: number
    status: LikeStatus
    fullPost?: boolean
    deletePost?: (postId: string) => void
}

export enum LikeStatus {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
    NONE = 'NONE'
}

const Post = ({
                  id,
                  user,
                  title,
                  text,
                  Photo,
                  video,
                  commentsAllowed,
                  variantsAllowed,
                  Variants,
                  isVoted,
                  createdAt,
                  likes,
                  dislikes,
                  status,
                  fullPost,
                  deletePost
              }: PostInterface) => {
    const [likesNumber, setLikesNumber] = useState<number>(likes)
    const [dislikesNumber, setDislikesNumber] = useState<number>(dislikes)
    const [currentStatus, setCurrentStatus] = useState<LikeStatus>(status)
    const [auth, setAuth] = useState<boolean>(true)
    const [progressNumber, setProgressNumber] = useState(0)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [reportModal, setReportModal] = useState<boolean>(false)
    const [variantList, setVariantList] = useState<Variant[]>(Variants ? Variants : [])
    const [votedStatus, setVotedStatus] = useState<boolean | undefined>(isVoted)
    const [variantModal, setVariantModal] = useState(false)
    const [openAddMenu, setOpenAddMenu] = useState<boolean>(false)
    const anchorRef = useRef<HTMLButtonElement>(null)
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])


    console.log(votedStatus)
    const handleAddMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpenAddMenu(false);
    }

    useEffect(() => {
        if (likesNumber + dislikesNumber) setProgressNumber(100 * likesNumber / (likesNumber + dislikesNumber))
        else setProgressNumber(50)
    }, [likesNumber, dislikesNumber])

    // если чел лайкает, и не зареган, то ему дастся модальное окно на вход, которое я импортирую с микрофронта юзера
    function handleLike() {
        if (currentUser) {
            likePostRequest(id)
            if (currentStatus == LikeStatus.DISLIKE) {
                setDislikesNumber((prevState) => prevState - 1)
                setLikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.LIKE)
            } else if (currentStatus == LikeStatus.LIKE) {
                setLikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.NONE)
            } else {
                setLikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.LIKE)
            }
        }
    }

    function handleDislike() {
        if (currentUser) {
            dislikePostRequest(id)
            if (currentStatus == LikeStatus.LIKE) {
                setDislikesNumber((prevState) => prevState + 1)
                setLikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.DISLIKE)
            } else if (currentStatus == LikeStatus.DISLIKE) {
                setDislikesNumber((prevState) => prevState - 1)
                setCurrentStatus(LikeStatus.NONE)
            } else {
                setDislikesNumber((prevState) => prevState + 1)
                setCurrentStatus(LikeStatus.DISLIKE)
            }
        }
    }

    function handleDeleteModalClickOpen() {
        setDeleteModal(true)
    }

    const handleAddMenuToggle = () => {
        setOpenAddMenu((prevOpen) => !prevOpen);
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
        setVariantList(prevState => ([...prevState, {id: id, text: text, votes: 1, postId: id}]))
    }

    function voteForVariant(variantId: string) {
        if (currentUser && Variants != undefined && !votedStatus) {
            const newList = variantList.map(variant => {
                if (variant.id == variantId) {
                    return {text: variant.text, votes: variant.votes+1, id: variant.id, postId: id}
                }
                return variant
            })
            voteForVariantRequest(variantId)
            setVariantList(newList)
            setVotedStatus(true)
        }
    }

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenAddMenu(false);
        } else if (event.key === 'Escape') {
            setOpenAddMenu(false);
        }
    }

    return (
        <ListItem alignItems="flex-start" sx={{boxShadow: 5, mb: 4, p: 3, pr: 4, pt: 2}}>
            <ListItemAvatar>
                <Link to={`/users/${user.linkNickname}/profile`} style={{ "textDecoration": "none" }}><Avatar alt="Remy Sharp" src={user.photo}/></Link>
            </ListItemAvatar>
            <ListItemText
                primary={<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box>
                        <Link to={`/users/${user.linkNickname}/profile`} style={{ "textDecoration": "none" }}>{user.nickname}</Link>
                        <em>&nbsp;{new Date(createdAt).getDate()}.{new Date(createdAt).getMonth() + 1}.{new Date(createdAt).getFullYear()} {String(new Date(createdAt).getHours()).padStart(2, '0')}:{String(new Date(createdAt).getMinutes()).padStart(2, '0')}</em>
                    </Box>
                    <Box>
                        <IconButton aria-label="settings"
                                    ref={anchorRef}
                                    id="composition-button"
                                    aria-controls={openAddMenu ? 'composition-menu' : undefined}
                                    aria-expanded={openAddMenu ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleAddMenuToggle}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </IconButton>
                        <Popper
                            open={openAddMenu}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            sx={{ zIndex: 100 }}
                            transition
                            disablePortal
                        >
                            {({TransitionProps, placement}) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom-start' ? 'right top' : 'rigth bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleAddMenuClose}>
                                            <MenuList
                                                autoFocusItem={openAddMenu}
                                                id="composition-menu"
                                                aria-labelledby="composition-button"
                                                sx={{ z: 10 }}
                                                onKeyDown={handleListKeyDown}
                                            >
                                                {currentUser && currentUser.id == user.userId && <MenuItem onClick={handleAddMenuClose}><Link to={`/posts/edit/${id}`} style={{ textDecoration: 'none' }}>Edit the post</Link></MenuItem>}
                                                {currentUser && <MenuItem onClick={handleReportModalClickOpen} sx={{color: 'error.main'}}>Report the post</MenuItem>}
                                                {currentUser && (currentUser.id == user.userId || currentUser.role == Role.ADMIN || currentUser.role == Role.MODERATOR) && <MenuItem onClick={handleDeleteModalClickOpen} sx={{color: 'text.secondary'}}>Delete the post</MenuItem>}
                                                {!fullPost && <MenuItem onClick={handleDeleteModalClickOpen}><Link to={`/posts/${id}`} style={{ textDecoration: 'none' }}>Open full post</Link></MenuItem>}
                                                {currentUser && currentUser.id != user.userId && Variants != undefined && votedStatus!=true && variantsAllowed && <MenuItem onClick={handleAddNewVariantModalClickOpen} sx={{color: 'text.primary'}}>Add variant</MenuItem>}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
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
                        {Photo && <Box sx={{mt: 2}}><ImageBlock images={Photo.map(item => item.link)}/></Box>}
                        {video && <Box sx={{mt: 2}}><YouTube videoId={video} opts={{width: '100%'}}/></Box>}
                        {Variants && Variants.length > 0 && <Box sx={{mt: 2}}><PollBlock postId={id} fullPost={fullPost} variants={variantList} isVoted={votedStatus} voteForVariant={votedStatus==false ? voteForVariant : (variantId: string)=> false }/></Box>}
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
            <ReportPostModal open={reportModal} onClose={handleReportModalClose} user={user.userId}/>
            <AddNewVariantModal postId={id} open={variantModal} onClose={handleAddNewVariantModalClose} addVariant={addNewVariant} />
        </ListItem>
    );
};

export default Post;