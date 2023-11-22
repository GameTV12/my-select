import React, {useState} from 'react';
import SubscriptionCard from "../components/SubscriptionCard";
import {Box, Grid} from "@mui/material";

type Subscription = {
    id: string
    nickname: string
    linkNickname: string
    image: string
    followers: number
}

const mockData: Subscription[] = [
    {id: 'HWURO-12301', nickname: "ProUser999", linkNickname: "prouser999super", image: "https://i.pinimg.com/originals/07/73/2f/07732f7b4c5de372fd4ac55ec33c59e0.jpg", followers: 123456},
    {id: 'OKOQZ-90192', nickname: "UserCool", linkNickname: "_usercoolpro_", image: "https://i.pinimg.com/564x/4a/56/19/4a56192ad653a06239356f1228faad0a.jpg", followers: 109},
    {id: 'ROZLK-99102', nickname: "Help me, because I'm the best", linkNickname: "best123", image: "https://i.pinimg.com/564x/4e/b9/3c/4eb93c1ac22b74b480eb6d1ac1447c24.jpg", followers: 2189},
    {id: 'PIPEC-10925', nickname: "Hello to me", linkNickname: "hellotome", image: "https://i.pinimg.com/564x/c7/bd/38/c7bd380b422f684dde2230920fde6994.jpg", followers: 17},
]
const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(mockData)

    function unsubscribeFromUser(id: string): void {
        if (subscriptions) setSubscriptions(subscriptions.filter((item) => item.id !== id))
    }

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                {subscriptions ? subscriptions.map(item =>
                    <SubscriptionCard
                        id={item.id}
                        nickname={item.nickname}
                        followers={item.followers}
                        image={item.image}
                        linkNickname={item.linkNickname}
                        onRemove={unsubscribeFromUser} />
                ) : ''}
            </Grid>
        </Grid>
    );
};

export default SubscriptionList;