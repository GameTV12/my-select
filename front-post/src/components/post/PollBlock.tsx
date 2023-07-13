import React, {useEffect, useState} from 'react';
import {Variant} from "./Post";
import VariantBar from "./VariantBar";
import {Divider, IconButton, InputBase, Paper} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'

interface PollBlockProps {
    variants: Variant[]
    postId: string
    isVoted?: boolean
    fullPost?: boolean
    voteForVariant: (id: string) => void
}

const PollBlock = ({variants, postId, isVoted, voteForVariant, fullPost}: PollBlockProps) => {
    const totalVotes = variants.reduce((x, y) => (x + y.votes), 0)
    const [wordFilter, setWordFilter] = useState('')
    let numberOfVariants = 5
    if (fullPost) numberOfVariants = 25

    console.log(variants)
    return <>
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 1 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search option"
                inputProps={{ 'aria-label': 'search google maps' }}
                value={wordFilter}
                onChange={(e) => setWordFilter(e.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
        {isVoted==false ?
            variants.filter(item=> item.title.toLowerCase().includes(wordFilter.toLowerCase())).slice(0, numberOfVariants).map((item, index) => <VariantBar postId={postId} voteForVariant={voteForVariant} percentage={0} id={item.id} title={item.title} numberOfVotes={'You haven\'t been voted yet'} key={index} />)
            :
            variants.sort((a, b) => b.votes - a.votes).filter(item=> item.title.toLowerCase().includes(wordFilter.toLowerCase())).slice(0, numberOfVariants).map((item, index) => <VariantBar postId={postId} percentage={totalVotes != 0 ? Number((item.votes/totalVotes * 100).toFixed(2)) : 0} id={item.id} title={item.title} numberOfVotes={item.votes.toString()} key={index} />)
        }
        </>
}

export default PollBlock