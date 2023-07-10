import React, {useState} from 'react';
import {Variant} from "./Post";
import VariantBar from "./VariantBar";

interface PollBlockProps {
    variants: Variant[]
    isVoted?: boolean
}

const PollBlock = ({variants, isVoted}: PollBlockProps) => {
    const [variantList, setVariantList] = useState<Variant[]>(variants)
    const [totalVotes, setTotalVotes] = useState(variantList.reduce((x, y) => (x + y.votes), 0))
    const [votedStatus, setVotedStatus] = useState<boolean | undefined>(isVoted ? isVoted : undefined)

    function voteForVariant(id: string) {
        const newList = variantList.map(variant => {
            if (variant.id == id) {
                return {title: variant.title, votes: variant.votes+1, id: variant.id}
            }
            return variant
        })
        setVotedStatus(true)
    }

    return <>
        {votedStatus==false ?
            variantList.map((item, index) => <VariantBar voteForVariant={voteForVariant} percentage={0} id={item.id} title={item.title} numberOfVotes={'You haven\'t been voted yet'} key={index} />)
            :
            variantList.sort((a, b) => b.votes - a.votes).map((item, index) => <VariantBar percentage={Number((item.votes/totalVotes * 100).toFixed(2))} id={item.id} title={item.title} numberOfVotes={item.votes.toString()} key={index} />)
        }
        </>
}

export default PollBlock