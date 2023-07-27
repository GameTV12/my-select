import React, {useEffect, useRef, useState} from 'react';
import {
    AppBar, Box,
    Button,
    FormControl, FormGroup,
    Grid,
    IconButton,
    List,
    ListItem, Paper,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import SouthIcon from '@mui/icons-material/South'
import {allComments} from "../mockData/mockComments"
import Comment, {CommentType, LikeStatus} from "../components/Comment"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import NorthIcon from '@mui/icons-material/North'
import dayjs from "dayjs"
import SendIcon from '@mui/icons-material/Send'
import ReplyIcon from "@mui/icons-material/Reply"
import CloseIcon from '@mui/icons-material/Close'
import {Navigate, useParams} from "react-router-dom"
import {Link} from "react-router-dom"

type FilterParams = {
    sortingArgs: number[]
    startDate?: dayjs.Dayjs
    endDate?: dayjs.Dayjs
}

const VariantCommentList = () => {
    const { id, variantId } = useParams()
    console.log('variantId - ' + variantId)


    const newComment: CommentType = {
        id: "HELL-OWOR-LD12",
        nickname: "David 999",
        linkNickname: "fortnite_david",
        userId: "USER-9018",
        image: "poimzcvu",
        text: "",
        time: (new Date()).getTime(),
        likes: 0,
        dislikes: 0,
        status: LikeStatus.NONE
    }
    const [commentText, setCommentText] = useState<string>("")
    const [filterData, setFilterData] = useState<FilterParams>({sortingArgs: [2, 0, 0], endDate: dayjs(new Date())});
    const [commentList, setCommentList] = useState(allComments)
    const scrollRef = useRef<null | HTMLDivElement>(null)
    const [repliedComment, setRepliedComment] = useState<CommentType | null>(null)
    const [countOfWrittenComments, setCountOfWrittenComments] = useState<number>(0)
    const [disableWriting, setDisableWriting] = useState(false)
    const [editableComment, setEditableComment] = useState<CommentType | null>(null);


    useEffect(() => {
        searchByFilters()
    }, [filterData])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [countOfWrittenComments])

    useEffect(() => {
        clearReply()
    }, [repliedComment])

    function editComment (commentId: string) {
        setRepliedComment(null)
        setCommentText('')
        const thisComment: CommentType | undefined = commentList.find(item => item.id == commentId)
        if (!thisComment) return
        setEditableComment(thisComment)
        setCommentText(thisComment.text)
        if ("repliedTo" in thisComment) {
            const thisReply: CommentType | undefined = commentList.find(item => item.id == thisComment.repliedTo)
            if (!thisReply) return
            setRepliedComment(thisReply)
        }
    }

    function updateComment (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent) {
        if (!editableComment || commentText.split(' ').join('').length == 0) return
        e.preventDefault()
        let copyComment = editableComment
        copyComment.text = commentText
        if (repliedComment) {
            copyComment.repliedTo = repliedComment.id
            copyComment.repliedNickname = repliedComment.nickname
            copyComment.repliedText = repliedComment.text
        }
        const newList = commentList.map(comment => {
            if (comment.id == copyComment.id) {
                return copyComment
            }
            return comment
        })
        setCommentList(newList)
        setCommentText('')
        setRepliedComment(null)
        setEditableComment(null)
    }

    function clearUpdate() {
        setCommentText('')
        setRepliedComment(null)
        setEditableComment(null)
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (editableComment == null) sendComment(e)
            else updateComment(e)
        }
    }

    function deleteComment(commentId: string) {
        setCommentList(commentList.filter((comment) => comment.id != commentId))
    }

    function replyComment(commentId: string) {
        const thisComment: CommentType | undefined = commentList.find(item => item.id == commentId)
        if (!thisComment) return
        setRepliedComment(thisComment)
    }

    function clearReply(){
        delete newComment.repliedTo
        delete newComment.repliedText
        delete newComment.repliedNickname
    }

    function sendComment(e: React.MouseEvent<HTMLElement> | React.KeyboardEvent) {
        e.preventDefault()
        if (commentText.split(' ').join('').length == 0) return
        newComment.time = (new Date()).getTime()
        newComment.text = commentText
        if (repliedComment != null) {
            console.log(repliedComment)
            newComment.repliedTo = repliedComment.id
            newComment.repliedNickname = repliedComment.nickname
            newComment.repliedText = repliedComment.text
        }
        setCommentList(prevState => [...prevState, newComment])
        setCommentText('')
        setRepliedComment(null)
        setCountOfWrittenComments((prev) => prev+1)

        setDisableWriting(true)

        setTimeout(() => {
            setDisableWriting(false)
        }, 5000)
    }


    function handleFilter(e: React.MouseEvent<HTMLElement>) {
        if (e.target && 'id' in e.target) {
            const newArr = [0, 0, 0]
            newArr[e.target.id as number] = (filterData.sortingArgs[e.target.id as number] + 1) % 3
            if (newArr[e.target.id as number] == 0) newArr[e.target.id as number] = 1
            setFilterData((prevState) => ({...prevState, sortingArgs: newArr}))
        }
    }

    function searchByFilters() {
        const filteredArray = allComments.filter(item => {
            // @ts-ignore
            if (filterData.endDate != undefined && filterData.endDate.unix() * 1000 >= item.time && filterData.startDate != undefined && filterData.startDate.unix() * 1000 <= item.time) return true
            else if (filterData.startDate == undefined && filterData.endDate != undefined && filterData.endDate.unix() * 1000 >= item.time) return true
            else if (filterData.endDate == undefined && filterData.startDate != undefined && filterData.startDate.unix() * 1000 <= item.time) return true
            else if (filterData.endDate == undefined && filterData.startDate == undefined) return true
            return false
        })
        if (filterData.sortingArgs[1] == 1) {
            filteredArray.sort((item1, item2) => item2.likes - item1.likes)
        } else if (filterData.sortingArgs[1] == 2) {
            filteredArray.sort((item1, item2) => item1.likes - item2.likes)
        } else if (filterData.sortingArgs[2] == 1) {
            filteredArray.sort((item1, item2) => item2.dislikes - item1.dislikes)
        } else if (filterData.sortingArgs[2] == 2) {
            filteredArray.sort((item1, item2) => item1.dislikes - item2.dislikes)
        } else if (filterData.sortingArgs[0] == 2) {
            filteredArray.sort((item1, item2) => item1.time - item2.time)
        } else if (filterData.sortingArgs[0] == 1) {
            filteredArray.sort((item1, item2) => item2.time - item1.time)
        }
        setCommentList(filteredArray)
    }

    return (
        <>
            <AppBar color={"inherit"}>
                <Toolbar>
                    <Grid container justifyContent="center" sx={{p: 0, position: "sticky", boxShadow: 0}}>
                        <Grid item xs={12} sm={2} md={1} lg={1} xl={1}
                              sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", p: 2}}>
                            <Link to={`/posts/${id}`}>
                                <IconButton>
                                    <KeyboardBackspaceIcon/>
                                </IconButton>
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={10} md={4} lg={4} xl={4}
                              sx={{display: "flex", justifyContent: "center", alignItems: "center", p: 1}}>
                            <List sx={{display: 'flex', flexDirection: "row", justifyContent: 'flex-end'}}>
                                <ListItem>Order&nbsp;by:</ListItem>
                                <ListItem><Typography variant="body1" component={"span"} id={'0'}
                                                      sx={{cursor: 'pointer'}}
                                                      onClick={(e) => handleFilter(e)}>Date</Typography>{filterData.sortingArgs[0] == 1 ?
                                    <SouthIcon/> : filterData.sortingArgs[0] == 2 ? <NorthIcon/> : ''}</ListItem>
                                <ListItem><Typography variant="body1" component={"span"} id={'1'}
                                                      sx={{cursor: 'pointer'}}
                                                      onClick={(e) => handleFilter(e)}>Likes</Typography>{filterData.sortingArgs[1] == 1 ?
                                    <SouthIcon/> : filterData.sortingArgs[1] == 2 ? <NorthIcon/> : ''}</ListItem>
                                <ListItem><Typography variant="body1" component={"span"} id={'2'}
                                                      sx={{cursor: 'pointer'}}
                                                      onClick={(e) => handleFilter(e)}>Dislikes</Typography>{filterData.sortingArgs[2] == 1 ?
                                    <SouthIcon/> : filterData.sortingArgs[2] == 2 ? <NorthIcon/> : ''}</ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={10} md={5} lg={6} xl={6}
                              sx={{display: "flex", justifyContent: "center", alignItems: "center", p: 1}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                From&nbsp;
                                <DatePicker value={filterData.startDate} onChange={(newValue) => {
                                    setFilterData({
                                        sortingArgs: filterData.sortingArgs,
                                        endDate: filterData.endDate,
                                        startDate: newValue != null ? newValue : undefined
                                    })
                                }}/>&nbsp;
                                To&nbsp;
                                <DatePicker value={filterData.endDate} onChange={(newValue) => {
                                    setFilterData({
                                        sortingArgs: filterData.sortingArgs,
                                        startDate: filterData.startDate,
                                        endDate: newValue == null ? filterData.endDate : newValue
                                    })
                                }}/>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={1} xl={1}
                              sx={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                            <Button color="error" onClick={() => setFilterData({
                                sortingArgs: [2, 0, 0],
                                endDate: dayjs(new Date()),
                                startDate: undefined
                            })}>
                                Clear&nbsp;filters
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Toolbar sx={{mb: 2}}/>

            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                    <List sx={{bgcolor: 'background.paper'}}>
                        {commentList.map((comment) => {
                            return <Comment key={comment.id} id={comment.id} nickname={comment.nickname}
                                            linkNickname={comment.linkNickname}
                                            image={comment.image} text={comment.text} time={comment.time}
                                            status={comment.status}
                                            userId={comment.userId}
                                            repliedTo={comment.repliedTo} repliedText={comment.repliedText}
                                            repliedNickname={comment.repliedNickname} deleteComment={deleteComment}
                                            likes={comment.likes} dislikes={comment.dislikes} editComment={editComment}
                                            replyComment={replyComment}/>
                        })}
                    </List>
                </Grid>
            </Grid>

            <AppBar color={"inherit"} sx={{top: 'auto', bottom: 0, position: "fixed",}}>
                <Toolbar>
                    <Grid container justifyContent="center" sx={{p: 0, boxShadow: 0}}>
                        <Grid item xs={12} sm={10} md={8} lg={8} xl={8}>
                            {repliedComment != null && <Box>
                                <Typography
                                    component="div"
                                    variant="body2"
                                    color="text.primary"
                                    align="justify"
                                    sx={{display: "flex", alignItems: "center", mt: 1}}
                                >
                                    <ReplyIcon/>&nbsp;{repliedComment.nickname}
                                </Typography>
                                <Typography
                                    component="div"
                                    variant="caption"
                                    color="text.secondary"
                                    align="justify"
                                    sx={{
                                        whiteSpace: 'pre-line',
                                        mb: 1,
                                        fontStyle: 'oblique',
                                        WebkitLineClamp: 1,
                                        display: "-webkit-box",
                                        px: 1,
                                        overflow: "hidden",
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {repliedComment.text}
                                </Typography>
                            </Box>}
                            <Paper component={"form"} sx={{ display: 'flex', alignItems: 'center', width: '100%', border: 0, boxShadow: 0 }}>
                                <TextField id={"text"}
                                           name={"text"}
                                           type={"text"}
                                           placeholder={"Write your comment"}
                                           multiline
                                           rows={3}
                                           required
                                           autoFocus
                                           value={commentText}
                                           onChange={(e) => setCommentText((prevState) => (e.target.value))}
                                           fullWidth
                                           sx={{my: 1}}
                                           inputProps={{maxLength: 600}}
                                           onKeyDown={handleKeyDown}
                                           label={`${commentText.length}/600 symbols used`}
                                           disabled={disableWriting && editableComment==null}
                                />
                                <FormGroup>
                                    {editableComment && <IconButton color={"primary"} onClick={clearUpdate}><CloseIcon /></IconButton>}
                                    <IconButton type={"submit"} color={"primary"} onClick={editableComment ? (e)=> updateComment(e) : (e) => sendComment(e)} disabled={disableWriting && editableComment==null}><SendIcon /></IconButton>
                                </FormGroup>
                                </Paper>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Toolbar sx={{my: 2}} ref={scrollRef}/>
        </>
    )
}

export default VariantCommentList;