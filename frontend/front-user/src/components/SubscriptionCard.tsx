import React, {FC} from 'react';
import {
    Avatar, Box, Button, Grid, Link,
    ListItem,
    ListItemAvatar,
    ListItemText
} from "@mui/material";

interface SubscriptionCard {
    id: string
    nickname: string
    linkNickname: string
    image: string
    followers: number
    onRemove: (arg0: string)=>void
}
const SubscriptionCard: FC<SubscriptionCard> = ({id, nickname, linkNickname, image, followers, onRemove}: SubscriptionCard) => {

    return (
        <ListItem sx={{ borderBottom: '1px gray solid', display: 'flex' }}>
            <ListItemAvatar>
                <Avatar>
                    <Box component={"img"} src={image} sx={{ objectFit: 'cover' }} minWidth={'100%'} minHeight={'100%'}/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={nickname}
                secondary={<Link href={"https://leetcode.com/"} target={"_blank"} underline="none">{linkNickname}</Link>}
            />
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>Followers: </strong><i>{followers}</i></div>
                <Button variant="contained" color={"error"} onClick={() => onRemove(id)}>Unsubscribe</Button>
            </Grid>
        </ListItem>
    );
};

export default SubscriptionCard