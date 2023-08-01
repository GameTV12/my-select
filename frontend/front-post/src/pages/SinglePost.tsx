import React from 'react';
import Post, {PostData} from "../components/post/Post";
import {Grid, List} from "@mui/material"
import { useParams } from 'react-router-dom'
import {allPosts} from "../mockData/mockPosts"

const SinglePost = () => {
    const params = useParams()
    console.log(params)
    const post: PostData = allPosts.filter(item=> item.id==params?.id)[0]

    return <>
            {post != undefined && params != undefined ? <Grid container justifyContent="center" sx={{ mt: 5 }}>
                <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                    <List sx={{bgcolor: 'background.paper'}}>
                        <Post id={post.id} nickname={post.nickname}
                              linkNickname={post.linkNickname}
                              userPhoto={post.userPhoto} text={post.text} createdAt={post.createdAt}
                              status={post.status} updatedAt={post.updatedAt}
                              userId={post.userId} photos={post.photos} video={post.video}
                              likes={post.likes} dislikes={post.dislikes} commentsAllowed={post.commentsAllowed}
                              title={post.title} variants={post.variants} isVoted={post.isVoted}
                              variantsAllowed={post.variantsAllowed} fullPost={true}/>
                    </List>
                </Grid>
            </Grid> : <></>}
        </>
};

export default SinglePost;