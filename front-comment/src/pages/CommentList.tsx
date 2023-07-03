import React, {useEffect, useRef, useState} from 'react';
import {
    AppBar,
    Button,
    FormControl,
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

type FilterParams = {
    sortingArgs: number[]
    startDate?: dayjs.Dayjs
    endDate?: dayjs.Dayjs
}

const CommentList = () => {
    const [newComment, setNewComment] = useState<CommentType>({
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
    })
    const [commentText, setCommentText] = useState<string>("")
    const [filterData, setFilterData] = useState<FilterParams>({sortingArgs: [2, 0, 0], endDate: dayjs(new Date())});
    const [commentList, setCommentList] = useState(allComments)
    const scrollRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        searchByFilters()
    }, [filterData])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [newComment.time]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') sendComment(e)
    }

    function deleteComment(commentId: string) {
        setCommentList(commentList.filter((comment) => comment.id != commentId))
    }

    function sendComment(e: React.MouseEvent<HTMLElement> | React.KeyboardEvent) {
        e.preventDefault()
        setNewComment((prevState) => ({...prevState, time: (new Date()).getTime(), text: commentText }))
        setCommentList(prevState => [...prevState, newComment])
        setCommentText('')
    }

    console.log(filterData.sortingArgs)

    function handleFilter(e: React.MouseEvent<HTMLElement>) {
        if (e.target && 'id' in e.target) {
            console.log(e)
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
            filteredArray.sort((item1, item2) => item2.likes - item1.likes);
            console.log('11')
        } else if (filterData.sortingArgs[1] == 2) {
            filteredArray.sort((item1, item2) => item1.likes - item2.likes);
            console.log('12')
        } else if (filterData.sortingArgs[2] == 1) {
            filteredArray.sort((item1, item2) => item2.dislikes - item1.dislikes);
            console.log('21')
        } else if (filterData.sortingArgs[2] == 2) {
            filteredArray.sort((item1, item2) => item1.dislikes - item2.dislikes);
            console.log('22')
        } else if (filterData.sortingArgs[0] == 2) {
            filteredArray.sort((item1, item2) => item1.time - item2.time);
            console.log('01')
        } else if (filterData.sortingArgs[0] == 1) {
            filteredArray.sort((item1, item2) => item2.time - item1.time);
            console.log('02')
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
                            <IconButton>
                                <KeyboardBackspaceIcon/>
                            </IconButton>
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
                                            replyTo={comment.replyTo} replyText={comment.replyText}
                                            replyNickname={comment.replyNickname} deleteComment={deleteComment}
                                            likes={comment.likes} dislikes={comment.dislikes}/>
                        })}
                    </List>
                </Grid>
            </Grid>

            <AppBar color={"inherit"} sx={{top: 'auto', bottom: 0, position: "fixed",}}>
                <Toolbar>
                    <Grid container justifyContent="center" sx={{p: 0, boxShadow: 0}}>
                        <Grid item xs={12} sm={10} md={8} lg={8} xl={8}>
                            <Paper component={"form"} sx={{ display: 'flex', alignItems: 'center', width: '100%', border: 0, boxShadow: 0 }}>
                                <TextField id={"text"}
                                           name={"text"}
                                           type={"text"}
                                           placeholder={"Write your comment"}
                                           multiline
                                           rows={3}
                                           required
                                           value={commentText}
                                           onChange={(e) => setCommentText((prevState) => (e.target.value))}
                                           fullWidth
                                           sx={{mt: 2, mb: 1}}
                                           inputProps={{maxLength: 600}}
                                           onKeyDown={handleKeyDown}
                                           label={`${commentText.length}/600 symbols used`}
                                />
                                <IconButton type={"submit"} color={"primary"} onClick={(e) => sendComment(e)}><SendIcon /></IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Toolbar sx={{my: 2}} ref={scrollRef}/>
        </>
    )
}

export default CommentList;