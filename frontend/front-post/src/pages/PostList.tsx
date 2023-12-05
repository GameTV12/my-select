import React, {Suspense, useEffect, useState} from 'react';
import Post, {PostInterface} from "../components/post/Post"
import {Grid, List} from "@mui/material";
import {Navigate, useLocation, useParams} from "react-router-dom";
import {getTrendingPosts, searchPosts} from "../utils/publicRequests";
import {useCookies} from "react-cookie";
import {UserI} from "../utils/axiosInstance";
import {jwtDecode} from "jwt-decode";
import {getTrendingPostsAuth, searchPostsAuth} from "../utils/authRequest";


const PostList = () => {
    const location = useLocation()
    const myParams = new URLSearchParams(location.search).get('args')
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);
    const [postList, setPostList] = useState<PostInterface[]>([]);
    const [searchArgs, setSearchArgs] = useState<string | null>(myParams);

    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])


    useEffect(() => {
        if (searchArgs == null || searchArgs == '') {
            if (currentUser) {
                getTrendingPostsAuth().then(r => {setPostList(r)}).catch(() => {
                    return <Navigate replace to={'/'} />
                })
            } else {
                getTrendingPosts().then(r => {setPostList(r)}).catch(() => {
                    return <Navigate replace to={'/'} />
                })
            }
        }
        else {
            if (currentUser) {
                searchPostsAuth(searchArgs).then(r => {setPostList(r)}).catch(() => {
                    return <Navigate replace to={'/'} />
                })
            } else {
                searchPosts(searchArgs).then(r => {setPostList(r)}).catch(() => {
                    return <Navigate replace to={'/'} />
                })
            }
        }
    }, [searchArgs, myParams, location]);

    function deletePost(postId: string) {
        setPostList(postList.filter((post) => post.id != postId))
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <List sx={{bgcolor: 'background.paper'}}>
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

export default PostList;