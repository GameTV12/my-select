import React, {useEffect, useState} from 'react';
import SubscriptionCard from "../components/SubscriptionCard";
import {Box, Grid} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import {UserI} from "../utils/axiosInstance";
import {useCookies} from "react-cookie";
import {getAllFollowers} from "../utils/publicRequests";
import {subscribeRequest} from "../utils/authRequests";

type Subscription = {
    followingUser: {
        id: string
        nickname: string
        linkNickname: string
        photo: string
        _count: { Followers: number }
    }
}

const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [cookies, setCookie] = useCookies(['myselect_access', 'myselect_refresh'])
    const [currentUser, setCurrentUser] = useState<UserI | null>(cookies.myselect_refresh ? jwtDecode(cookies.myselect_refresh) : null);
    useEffect(() => {
        if (cookies.myselect_refresh) setCurrentUser(jwtDecode(cookies.myselect_refresh))
        else setCurrentUser(null)
    }, [cookies])

    function unsubscribeFromUser(id: string): void {
        if (subscriptions) {
            setSubscriptions(subscriptions.filter((item) => item.followingUser?.id !== id))
            subscribeRequest(id)
        }
    }

    useEffect(() => {
        if (currentUser) {
            getAllFollowers(currentUser.linkNickname).then(r => {setSubscriptions(r); console.log(r)})
        }
    }, [])



    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                {subscriptions ? subscriptions.map(item =>
                    <SubscriptionCard
                        id={item.followingUser.id}
                        nickname={item.followingUser.nickname}
                        followers={item.followingUser._count.Followers}
                        image={item.followingUser.photo}
                        linkNickname={item.followingUser.linkNickname}
                        onRemove={unsubscribeFromUser} />
                ) : ''}
            </Grid>
        </Grid>
    );
};

export default SubscriptionList;