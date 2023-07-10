import React from 'react';
import Post, {LikeStatus, PostData} from "../components/post/Post";
import {Grid, List} from "@mui/material";

const mockSinglePost: PostData = {
    "id": "72a77caf-ae78-4efe-aeaf-e3e4d55773f4",
    "userId": "85dcfd28-9260-4afb-95f5-21e9a459378e",
    "nickname": "Ak Embrian",
    "linkNickname": "akembry5",
    "userPhoto": "https://e0.pxfuel.com/wallpapers/753/461/desktop-wallpaper-steam-profile-avatar-na-steam-pubg-avatar.jpg",
    "title": "praesent blandit nam",
    "text": "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.\n\nIn hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
    "commentsAllowed": true,
    "likes": 32958,
    "dislikes": 23679,
    "status": LikeStatus.LIKED,
    "variantsAllowed": true,
    "variants": [
        {title: "Option 1", votes: 150},
        {title: "Option 2", votes: 1324},
        {title: "Option 3", votes: 89},
        {title: "Option 4", votes: 934},
        {title: "Option 5", votes: 333},
        {title: "Option 6", votes: 707},
        {title: "Option 7", votes: 562},
        {title: "Option 8", votes: 146},
        {title: "Option 9", votes: 2903},
        {title: "Option 10", votes: 65},
        {title: "Option 11", votes: 1809},
        {title: "Option 12", votes: 901},
        {title: "Option 13", votes: 46},
    ],
    isVoted: false,
    "createdAt": 1670833298000,
    "updatedAt": 1686869079000
}

const SinglePost = () => {
    return (
        <Grid container justifyContent="center" sx={{ mt: 5 }}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                <List sx={{bgcolor: 'background.paper'}}>
                    <Post id={mockSinglePost.id} commentsAllowed={mockSinglePost.commentsAllowed} title={mockSinglePost.title}
                          updatedAt={mockSinglePost.updatedAt} createdAt={mockSinglePost.createdAt}
                          userPhoto={mockSinglePost.userPhoto} likes={mockSinglePost.likes} userId={mockSinglePost.userId}
                          text={mockSinglePost.text} status={mockSinglePost.status} isVoted={mockSinglePost.isVoted}
                          variants={mockSinglePost.variants} linkNickname={mockSinglePost.linkNickname}
                          nickname={mockSinglePost.nickname} variantsAllowed={mockSinglePost.variantsAllowed}
                          video={mockSinglePost.video} photos={mockSinglePost.photos}
                          dislikes={mockSinglePost.dislikes}/>
                </List>
            </Grid>
        </Grid>
    );
};

export default SinglePost;