import React from 'react';
import {Box, styled} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

interface VariantProps {
    id: string,
    title: string,
    numberOfVotes: string
    percentage: number
    voteForVariant?: (id: string) => void
}

const CustomProgressBar = styled('div')({
    position: 'relative',
    overflow: 'hidden',
    height: '35px',
    borderRadius: '5px',
    backgroundColor: '#aaa',
    marginBottom: 5,
})

const CustomFilled = styled('div')({
    height: "100%",
    backgroundColor: "#a03fff",
    transition: "width 1s",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textIndent: '5px',
    whiteSpace: 'nowrap',
    color: 'white'
})

const VariantBar = ({id, title, numberOfVotes, percentage, voteForVariant}: VariantProps) => {

    return (
        <Tooltip title={numberOfVotes}>
            <CustomProgressBar>
                <CustomFilled sx={{
                    width: voteForVariant==undefined ? 0 : percentage, cursor: 'pointer' }} onClick={voteForVariant!=undefined ? () => voteForVariant(id) : () => false}><div>{title} {voteForVariant!=undefined && <>({percentage}%)</>}</div></CustomFilled>
            </CustomProgressBar>
        </Tooltip>
    );
};

export default VariantBar;