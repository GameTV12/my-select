import React, {useState} from 'react';
import Post, {PostInterface} from "../components/post/Post";
import {Box, Grid, List, Tab, Typography} from "@mui/material"
import {Navigate, useParams} from 'react-router-dom'
import {
    getPostDislikeStatistics,
    getPostLikeStatistics,
    getPostPollStatistics,
    getSinglePost
} from "../utils/publicRequests";
import { useEffect } from "react";
import {useCookies} from "react-cookie"
import {UserI} from "../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {getSinglePostAuth} from "../utils/authRequest";
import {TabContext} from "@mui/lab";
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Line} from "react-chartjs-2"
import {Chart as ChartJS, ChartEvent, registerables} from 'chart.js';

ChartJS.register(...registerables)
import 'chartjs-plugin-annotation'

const fake = [
    {
        "time": 1701043200000,
        "parameter": 0,
        "realParameter": 0
    },
    {
        "time": 1701129600000,
        "parameter": 0,
        "realParameter": 0
    },
]

export type Statistics = {
    time: number
    parameter: number
    realParameter: number
}

const SinglePost = () => {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);
    const { id } = useParams()
    const [likeStatistics, setLikeStatistics] = useState<Statistics[]>(fake);
    const [dislikeStatistics, setDislikeStatistics] = useState<Statistics[]>(fake);
    const [pollStatistics, setPollStatistics] = useState<Statistics[]>(fake);
    const [tabPosition, setTabPosition] = useState<string>('1');

    useEffect(() => {
        let response;
        if (id != undefined) {
            if (currentUser) {
                getSinglePostAuth(id).then(r => {setPost(r)}).catch(r => {
                    return <Navigate replace to={'/'} />
                })
            }
            else {
                getSinglePost(id).then(r => {setPost(r)}).catch(r => {
                    return <Navigate replace to={'/'} />
                })
            }
            getPostLikeStatistics(id).then(r => setLikeStatistics(r))
            getPostDislikeStatistics(id).then(r => setDislikeStatistics(r))
            getPostPollStatistics(id).then(r => setPollStatistics(r))
        }
    }, [id]);
    const [post, setPost] = useState<PostInterface>();

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

    useEffect(() => {
        setChartLikesData({
            labels: likeStatistics.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth() + 1}.${new Date(data.time).getFullYear()}`)),
            type: "line",
            datasets: [{
                label: "Likes",
                data: likeStatistics.map((data) => data.parameter),
                backgroundColor: 'blue',
            }, {
                label: "Verified likes",
                data: likeStatistics.map((data) => data.realParameter),
                backgroundColor: 'lightgreen',
            }],
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
            },
        });
    }, [likeStatistics])

    useEffect(() => {
        setChartDislikesData({
            labels: dislikeStatistics.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth() + 1}.${new Date(data.time).getFullYear()}`)),
            type: "line",
            datasets: [{
                label: "Dislikes",
                data: dislikeStatistics.map((data) => data.parameter),
                backgroundColor: 'blue',
            }, {
                label: "Verified dislikes",
                data: dislikeStatistics.map((data) => data.realParameter),
                backgroundColor: 'lightgreen',
            }],
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
            },
        });
    }, [dislikeStatistics])

    useEffect(() => {
        setChartPollData({
            labels: pollStatistics.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth() + 1}.${new Date(data.time).getFullYear()}`)),
            type: "line",
            datasets: [{
                label: "Votes",
                data: pollStatistics.map((data) => data.parameter),
                backgroundColor: 'blue',
            }, {
                label: "Verified votes",
                data: pollStatistics.map((data) => data.realParameter),
                backgroundColor: 'lightgreen',
            }],
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
            },
        })
    }, [pollStatistics]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabPosition(newValue)
    }

    const [chartLikesData, setChartLikesData] = useState(
        {
            labels: likeStatistics.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth() + 1}.${new Date(data.time).getFullYear()}`)),
            type: "line",
            datasets: [{
                label: "Likes",
                data: likeStatistics.map((data) => data.parameter),
                backgroundColor: 'blue',
            }, {
                label: "Verified likes",
                data: likeStatistics.map((data) => data.realParameter),
                backgroundColor: 'lightgreen',
            }],
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
            },
        }
    )

    const [chartDislikesData, setChartDislikesData] = useState(
        {
            labels: dislikeStatistics.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth() + 1}.${new Date(data.time).getFullYear()}`)),
            type: "line",
            datasets: [{
                label: "Dislikes",
                data: dislikeStatistics.map((data) => data.parameter),
                backgroundColor: 'blue',
            }, {
                label: "Verified dislikes",
                data: dislikeStatistics.map((data) => data.realParameter),
                backgroundColor: 'lightgreen',
            }],
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
            },
        }
    )

    const [chartPollData, setChartPollData] = useState(
        {
            labels: pollStatistics.map((data) => (`${new Date(data.time).getDate()}.${new Date(data.time).getMonth() + 1}.${new Date(data.time).getFullYear()}`)),
            type: "line",
            datasets: [{
                label: "Votes",
                data: pollStatistics.map((data) => data.parameter),
                backgroundColor: 'blue',
            }, {
                label: "Verified votes",
                data: pollStatistics.map((data) => data.realParameter),
                backgroundColor: 'lightgreen',
            }],
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
            },
        }
    );
    // @ts-ignore
    const chartLikes = <Line data={chartLikesData} options={chartLikesData.options}/>
    // @ts-ignore
    const chartDislikes = <Line data={chartDislikesData} options={chartDislikesData.options}/>
    // @ts-ignore
    const chartPoll = <Line data={chartPollData} options={chartPollData.options}/>

    return <>
            {post != undefined && id != undefined ? <Grid container justifyContent="center" sx={{ mt: 5 }}>
                <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                    <List sx={{bgcolor: 'background.paper'}}>
                        <Post id={post.id} user={post.user} text={post.text} createdAt={post.createdAt}
                              status={post.status}
                              Photo={post.Photo} video={post.video}
                              likes={post.likes} dislikes={post.dislikes} commentsAllowed={post.commentsAllowed}
                              title={post.title} Variants={post.Variants} isVoted={post.isVoted}
                              variantsAllowed={post.variantsAllowed} fullPost={true}/>
                    </List>
                    <Box sx={{width: '100%', typography: 'body1', mt: 2}}>
                        <TabContext value={tabPosition}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    <Tab label="Likes" value="1"/>
                                    <Tab label="Dislikes" value="2"/>
                                    {post.Variants && post.Variants.length > 0 && <Tab label="Poll" value="3"/>}
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Box>
                                    <Typography variant={"h5"} align={"center"}>Likes
                                        of the post</Typography>
                                    {chartLikes}
                                </Box>
                            </TabPanel>
                            <TabPanel value="2">
                                <Box>
                                    <Typography variant={"h5"} align={"center"}>Dislikes
                                        of the post</Typography>
                                    {chartDislikes}
                                </Box>
                            </TabPanel>
                            {post.Variants && post.Variants.length > 0 &&
                                <TabPanel value="3">
                                    <Box>
                                        <Typography variant={"h5"} align={"center"}>Votes of the post</Typography>
                                        {chartPoll}
                                    </Box>
                                </TabPanel>
                            }
                        </TabContext>
                    </Box>
                </Grid>
            </Grid> : <></>}
        </>
};

export default SinglePost;