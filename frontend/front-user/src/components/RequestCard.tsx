import React, {FC} from 'react';
import {
    Avatar, Box, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    IconButton, IconButtonProps, Link,
    Typography
} from "@mui/material";
import {red} from "@mui/material/colors"
import { styled } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SubscriptionCard from "./SubscriptionCard";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface RequestCard {
    id: string
    nickname: string
    linkNickname: string
    description: string
    image: string
    date: string
    makeDecision: (id: string, decision: boolean)=>void
}
const RequestCard: FC<RequestCard> = ({id, nickname, linkNickname, image, date, makeDecision, description}: RequestCard) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ m: 1 }}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        <Box component={"img"} src={image} sx={{ objectFit: 'cover' }} minWidth={'100%'} minHeight={'100%'}/>
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </IconButton>
                }
                title={nickname}
                subheader={<Link href={"https://leetcode.com/"} target={"_blank"} underline="none">{linkNickname}</Link>}
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography>
                        {description}
                    </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 1 }}>
                            <Button variant="contained" color={"success"} sx={{ px: 4 }} onClick={() => {
                                handleExpandClick(); makeDecision(id, true)}}>Accept</Button>
                            <Button variant="contained" color={"error"} sx={{ px: 4 }} onClick={() => { handleExpandClick(); makeDecision(id, false)}}>Decline</Button>
                        </Box>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default RequestCard;