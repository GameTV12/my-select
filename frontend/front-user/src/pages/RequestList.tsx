import React, {useEffect, useState} from 'react'
import {Grid} from "@mui/material"
import RequestCard from "../components/RequestCard";
import {getAllRequests} from "../utils/publicRequests";
import {Navigate} from "react-router-dom";
import {acceptRequest, denyRequest} from "../utils/authRequests";

type Request = {
    id: string
    user: {
        nickname: string
        linkNickname: string
        photo: string
    }
    text: string
}

const RequestList = () => {
    const [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        let response;
        getAllRequests().then(r => setRequests(r)).catch(r => {
            return <Navigate replace to={'/'} />
        })
    }, []);

    function decideToRequest(id: string, decision: boolean): void {
        if (requests) setRequests(requests.filter((item) => item.id !== id))
        if (decision) acceptRequest(id)
        else denyRequest(id)
    }

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                {requests && requests.length > 0 ? requests.map(item =>
                    <RequestCard
                        id={item.id}
                        nickname={item.user?.nickname}
                        image={item.user?.photo}
                        linkNickname={item.user?.linkNickname}
                        description={item.text}
                        makeDecision={decideToRequest} />
                ) : ''}
            </Grid>
        </Grid>
    );
};

export default RequestList;