import React, {Suspense, useEffect, useState} from 'react';
import Post, {PostInterface} from "../components/post/Post"
import {Grid, List, ListItem, Button, Avatar, ListItemAvatar, Box, ListItemText} from "@mui/material";
import {Navigate, useParams} from "react-router-dom";
import {getUserInfo, getUserPosts} from "../utils/publicRequests";
import { Link } from "react-router-dom";

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

    useEffect(() => {
        if (id != undefined) {
            console.log('id - ' + id)
            getUserPosts(id).then(r => {setPostList(r); console.log(r)}).catch(() => {
                return <Navigate replace to={'/'} />
            })
            getUserInfo(id).then(r => setUserInfo(r));
        }
    }, [id]);

    const [postList, setPostList] = useState<PostInterface[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

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
                            <div><strong>Followers: </strong><i>{userInfo._count?.Followers}</i></div>
                            {userInfo.subscribed ? <Button variant="contained" color={"error"}>Unsubscribe</Button> : <Button variant="contained" color={"success"}>Subscribe</Button>}
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