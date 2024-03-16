import React, {useEffect, useState} from 'react';
import {Box, Grid, ListItem} from "@mui/material";
import {findUserByNickname, getAllReports} from "../utils/publicRequests";
import {Navigate} from "react-router-dom";

interface ReportInterface {
    id: string
    senderId: string
    text: string
    reportedUserId: string
}

const ReportList = () => {
    useEffect(() => {
        let response;
        getAllReports().then(r => setRequests(r)).catch(r => {
            return <Navigate replace to={'/'} />
        })
    }, []);

    const [requests, setRequests] = useState<ReportInterface[]>([])

    return (
        <Grid container justifyContent="center" sx={{mt: '20px', mb: '10px'}}>
            <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
                {requests ? requests.map(item =>
                    <ListItem sx={{boxShadow: 3, mb: 4, p: 3, pr: 4, pt: 2}}>{item.text}</ListItem>
                ) : ''}
            </Grid>
        </Grid>
    );
};

export default ReportList;