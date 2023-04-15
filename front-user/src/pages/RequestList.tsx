import React, {useState} from 'react'
import {Grid} from "@mui/material"
import RequestCard from "../components/RequestCard";

type Request = {
    id: string
    nickname: string
    linkNickname: string
    description: string
    image: string
    date: string
}

const mockData: Request[] = [
    {id: 'HWURO-12301', nickname: "GameTV", linkNickname: "gametvcity", image: "https://sun9-34.userapi.com/impf/c622320/v622320607/4e1d6/1a-awkhClos.jpg?size=225x225&quality=96&sign=c175c8c775a36c0b9721b5bd319b0155&type=album", date: Date.now().toString(), description: "Hello, please, I wanna be a moderator, it's very important for me"},
    {id: 'OKOQZ-90192', nickname: "UserCool", linkNickname: "_usercoolpro_", image: "https://sun9-65.userapi.com/impg/4UYDcKyeCcRpB3oMXDv1DBru4QBfiUVpmfjEsw/QljKWfKD4kQ.jpg?size=480x640&quality=95&sign=1484303aa4b87ef1f3fe0b3bf8446df7&type=album", date: Date.now().toString(), description: "Hello, please, I wanna be a moderator, it's very important for me"},
    {id: 'ROZLK-99102', nickname: "Help me, because I'm the best", linkNickname: "best123", image: "https://sun9-43.userapi.com/impg/RCZmHqtsE90jQArJSNpEFF2tKwSLnX_RBUZL1A/W3xH2Kudpjg.jpg?size=1280x720&quality=95&sign=badaf120dff9edc78a547e8ef8707a42&type=album", date: Date.now().toString(), description: "Hello, please, I wanna be a moderator, it's very important for me"},
    {id: 'PIPEC-10925', nickname: "Hello to me", linkNickname: "hellotome", image: "https://sun9-56.userapi.com/impg/ueRy2WxkhjlPgO8K2QLrTZ4G3ec2tOODprTJ8w/X2hkcDF5OHU.jpg?size=626x436&quality=96&sign=bff402867d28346374ba20a92ba503c4&type=album", date: Date.now().toString(), description: "Hello, please, I wanna be a moderator, it's very important for me"},
]
const RequestList = () => {
    const [requests, setRequests] = useState<Request[] | null>(mockData)

    function decideToRequest(id: string, decision: boolean): void {
        if (requests) setRequests(requests.filter((item) => item.id !== id))
        console.log(decision)
    }

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                {requests ? requests.map(item =>
                    <RequestCard
                        id={item.id}
                        nickname={item.nickname}
                        image={item.image}
                        linkNickname={item.linkNickname}
                        date={item.date}
                        description={item.description}
                        makeDecision={decideToRequest} />
                ) : ''}
            </Grid>
        </Grid>
    );
};

export default RequestList;