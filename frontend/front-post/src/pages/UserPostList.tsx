import React, {Suspense, useEffect, useState} from 'react';
import Post, {PostInterface} from "../components/post/Post"
import {Grid, List, ListItem, Button, Avatar, ListItemAvatar, Box, ListItemText} from "@mui/material";
import {Navigate, useParams} from "react-router-dom";
import {getUserInfo, getUserPosts} from "../utils/publicRequests";
import { Link } from "react-router-dom";
import {useCookies} from "react-cookie";
import {UserI} from "../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {getUserInfoAuth, getUserPostsAuth, subscribeRequest} from "../utils/authRequest";

interface UserInfo {
    createdAt: Date
    id: string
    nickname: string
    photo: string
    secondVerification: boolean
    subscribed: boolean
    visible: boolean,
    _count: {
        Followers: number
    }
    linkNickname: string
    role: string
}

const UserPostList = () => {
    const { id } = useParams();
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);
    const [postList, setPostList] = useState<PostInterface[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [subscribeStatus, setSubscribeStatus] = useState(userInfo.subscribed);
    const [followers, setFollowers] = useState(0);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

    useEffect(() => {
        if (id != undefined) {
            if (currentUser) {
                getUserPostsAuth(id).then(r => {setPostList(r)}).catch(() => {
                    return <Navigate replace to={'/'} />
                })
                getUserInfoAuth(id).then(r => {setUserInfo(r); setFollowers(r._count.Followers), setSubscribeStatus(r.subscribed)});
            } else {
                getUserPosts(id).then(r => {setPostList(r)}).catch(() => {
                    return <Navigate replace to={'/'} />
                })
                getUserInfo(id).then(r => {setUserInfo(r), setFollowers(r._count.Followers)});
            }

        }
    }, [id]);

    const handleSubscribe = () => {
        if (currentUser) {
            setSubscribeStatus((prev) => !prev)
            if (subscribeStatus) setFollowers(prev => prev - 1)
            else setFollowers(prev => prev + 1)
            subscribeRequest(userInfo.id)
        }
    }


    function deletePost(postId: string) {
        setPostList(postList.filter((post) => post.id != postId))
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <List sx={{bgcolor: 'background.paper'}}>
                    <ListItem sx={{boxShadow: 5, mb: 4, p: 3, pr: 4, display: 'flex'}}>
                        <ListItemAvatar>
                            <Avatar>
                                <Box component={"img"} src={userInfo.photo} sx={{ objectFit: 'cover' }} minWidth={'100%'} minHeight={'100%'}/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={userInfo.nickname}
                            secondary={<Link to={`/users/${userInfo.linkNickname}/profile`}>{userInfo.linkNickname}</Link>}
                        />
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><strong>Followers: </strong><i>{followers}</i></div>
                            {subscribeStatus ?
                                <Button variant="contained" color={"error"} onClick={handleSubscribe}>Unsubscribe</Button> :
                                currentUser && currentUser.id == userInfo.id ? <></> :
                                <Button variant="contained" color={"success"} onClick={handleSubscribe}>Subscribe</Button>
                            }
                        </Grid>
                    </ListItem>
                    {postList
                        .sort((item1, item2) => new Date(item2.createdAt).getTime() - new Date(item1.createdAt).getTime())
                        .map((post) => {
                        return (<Suspense fallback={<div>Loading...</div>}><Post key={post.id} id={post.id} user={post.user}
                                     text={post.text} createdAt={new Date(post.createdAt)}
                                     status={post.status} Photo={post.Photo} video={post.video}
                                     likes={post.likes} dislikes={post.dislikes} commentsAllowed={post.commentsAllowed}
                                     title={post.title} Variants={post.Variants} isVoted={post.isVoted}
                                     variantsAllowed={post.variantsAllowed} deletePost={deletePost}/>
                        </Suspense>)
                    })}
                </List>
            </Grid>
        </Grid>
    );
};

export default UserPostList;