import React, {useState} from 'react';
import Post, {PostInterface} from "../components/post/Post";
import {Grid, List} from "@mui/material"
import {Navigate, useParams} from 'react-router-dom'
import {getSinglePost} from "../utils/publicRequests";
import { useEffect } from "react";
import {useCookies} from "react-cookie"
import {UserI} from "../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {getSinglePostAuth} from "../utils/authRequest";

const SinglePost = () => {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);
    const { id } = useParams()
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
        }
    }, [id]);
    const [post, setPost] = useState<PostInterface>();

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

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
                </Grid>
            </Grid> : <></>}
        </>
};

export default SinglePost;