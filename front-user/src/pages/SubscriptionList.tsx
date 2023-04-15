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
    {id: 'HWURO-12301', nickname: "GameTV", linkNickname: "gametvcity", image: "https://sun9-34.userapi.com/impf/c622320/v622320607/4e1d6/1a-awkhClos.jpg?size=225x225&quality=96&sign=c175c8c775a36c0b9721b5bd319b0155&type=album", followers: 123456},
    {id: 'OKOQZ-90192', nickname: "UserCool", linkNickname: "_usercoolpro_", image: "https://sun9-65.userapi.com/impg/4UYDcKyeCcRpB3oMXDv1DBru4QBfiUVpmfjEsw/QljKWfKD4kQ.jpg?size=480x640&quality=95&sign=1484303aa4b87ef1f3fe0b3bf8446df7&type=album", followers: 109},
    {id: 'ROZLK-99102', nickname: "Help me, because I'm the best", linkNickname: "best123", image: "https://sun9-43.userapi.com/impg/RCZmHqtsE90jQArJSNpEFF2tKwSLnX_RBUZL1A/W3xH2Kudpjg.jpg?size=1280x720&quality=95&sign=badaf120dff9edc78a547e8ef8707a42&type=album", followers: 2189},
    {id: 'PIPEC-10925', nickname: "Hello to me", linkNickname: "hellotome", image: "https://sun9-56.userapi.com/impg/ueRy2WxkhjlPgO8K2QLrTZ4G3ec2tOODprTJ8w/X2hkcDF5OHU.jpg?size=626x436&quality=96&sign=bff402867d28346374ba20a92ba503c4&type=album", followers: 17},
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