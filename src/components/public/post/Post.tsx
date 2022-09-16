import React, {FC} from 'react';

interface PostProps {
    text: string,
    title: string,
    likes: number,
    dislikes: number,
    commercial: boolean,
    allowComments: boolean,
    visible: boolean,
    advertisement: boolean,
    timeStamp: number
}

export const Post: FC<PostProps> =
    ({
         text,
         title,
         likes,
         dislikes,
         commercial,
         allowComments,
         visible,
         advertisement,
         timeStamp
     }) => {
    return (
        <div>
            <div>User1234</div>
            <h4>{title}</h4>
            <div>{text}</div>
            <div>{likes}/{dislikes}</div>
        </div>
    );
};
