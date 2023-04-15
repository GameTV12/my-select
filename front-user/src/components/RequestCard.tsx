import React, {FC} from 'react';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    IconButton, IconButtonProps,
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
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
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
                subheader={date}
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography>
                        {description}
                    </Typography>

                </CardContent>
            </Collapse>
        </Card>
    );
};

export default RequestCard;