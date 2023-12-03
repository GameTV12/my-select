import React, {useState} from 'react';
import Post, {PostInterface} from "../components/post/Post";
import {Grid, List} from "@mui/material"
import {Navigate, useParams} from 'react-router-dom'
import {getSinglePost} from "../utils/publicRequests";
import { useEffect } from "react";
import {useCookies} from "react-cookie"

const SinglePost = () => {
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const { id } = useParams()
    useEffect(() => {
        let response;
        if (id != undefined) {
            getSinglePost(id).then(r => {setPost(r)}).catch(r => {
                return <Navigate replace to={'/'} />
            })
        }
    }, [id]);
    const [post, setPost] = useState<PostInterface>();

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