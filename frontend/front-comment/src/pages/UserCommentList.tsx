import React, {useEffect, useState} from 'react';
import Comment from "../components/Comment";
import dayjs from "dayjs";
import {allComments} from "../mockData/mockComments";
import {AppBar, Button, Grid, List, ListItem, Toolbar, Typography} from "@mui/material";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {FilterParams} from "./VariantCommentList";

const UserCommentList = () => {
    const [filterData, setFilterData] = useState<FilterParams>({sortingArgs: [2, 0, 0], endDate: dayjs(new Date())});
    const [commentList, setCommentList] = useState(allComments)

    useEffect(() => {
        searchByFilters()
    }, [filterData])

    function deleteComment(commentId: string) {
        setCommentList(commentList.filter((comment) => comment.id != commentId))
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
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
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
                                            likes={comment.likes} dislikes={comment.dislikes}/>
                        })}
                    </List>
                </Grid>
            </Grid>
        </>
    )
};

export default UserCommentList;