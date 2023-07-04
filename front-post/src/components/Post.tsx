import React from 'react';
import {
    Avatar,
    Box, Grid,
    IconButton, LinearProgress,
    Link,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";
import {PostData} from "../WritePost"
import EditIcon from '@mui/icons-material/Edit'
import FlagIcon from '@mui/icons-material/Flag'
import ReplyIcon from '@mui/icons-material/Reply'

interface UserData {
    nickname: string
    linkNickname: string
    photo: string
    createdAt: Date
    subscribers: number
}

const Post = ({
                  title,
                  text,
                  photos,
                  video,
                  commentsAllowed,
                  variantsAllowed,
                  variants,
                  nickname,
                  linkNickname,
                  photo,
                  createdAt,
                  subscribers
              }: PostData & UserData) => {
    return (
        <ListItem alignItems="flex-start" sx={{boxShadow: 1, mb: 4, p: 3, pr: 4, pt: 2}}>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={photo}/>
            </ListItemAvatar>
            <ListItemText
                primary={<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box>
                        <Link href={"https://leetcode.com/"} target={"_blank"} underline="none">{nickname}</Link>
                        <em>&nbsp;{new Date(createdAt).getDate()}.{new Date(createdAt).getMonth() + 1}.{new Date(createdAt).getFullYear()} {String(new Date(createdAt).getHours()).padStart(2, '0')}:{String(new Date(createdAt).getMinutes()).padStart(2, '0')}</em>
                    </Box>
                    <Box>
                        <Tooltip title={"Report"}><IconButton
                            onClick={handleReportModalClickOpen}><FlagIcon/></IconButton></Tooltip>
                        <Tooltip title={"Delete"}><IconButton
                            onClick={handleDeleteModalClickOpen}><CancelPresentationIcon/></IconButton></Tooltip>
                        {editComment && <Tooltip title={"Edit comment"}><IconButton
                            onClick={() => editComment(id)}><EditIcon/></IconButton></Tooltip>}
                    </Box>
                </Box>}
                secondary={
                    <>
                        <Typography
                            component="div"
                            variant="body2"
                            color="text.primary"
                            align="justify"
                            sx={{whiteSpace: 'pre-line', mt: 0.5}}
                        >
                            {text}
                        </Typography>
                        <Grid container sx={{
                            p: 1,
                            bgcolor: 'background.paper',
                        }}>
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                                <ListItem sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                    <ListItem><ReactionComponent numberOfReaction={likesNumber}
                                                                 handleReaction={handleLike} status={currentStatus}
                                                                 type={"like"}/></ListItem>
                                    <ListItem><ReactionComponent numberOfReaction={dislikesNumber}
                                                                 handleReaction={handleDislike} status={currentStatus}
                                                                 type={"dislike"}/></ListItem>
                                </ListItem>
                                <Tooltip title={`${likesNumber} / ${dislikesNumber}`}><LinearProgress
                                    variant="determinate" value={progressNumber}/></Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8} lg={9} xl={9}
                                  sx={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',
                                      alignItems: 'center'
                                  }}>
                                <ListItem sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                        sx={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        R
                                    </Typography>
                                </ListItem>
                            </Grid>
                        </Grid>
                    </>
                }
            />
            {/*{deleteComment && <DeleteCommentModal open={deleteModal} onClose={handleDeleteModalClose} commentId={id}*/}
            {/*                                      deleteComment={deleteComment}/>}*/}
            {/*<ReportCommentModal open={reportModal} onClose={handleReportModalClose} user={userId}/>*/}
        </ListItem>
    );
};

export default Post;