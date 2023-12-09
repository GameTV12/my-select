import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {firstVerificationRequest} from "../../utils/publicRequests";

const FirstVerify = () => {
    const navigate = useNavigate()
    const { link } = useParams()
    useEffect(() => {
        if (link) {
            firstVerificationRequest(link).then(() => {
                return navigate(`/`)
            })
        }
    }, [link])
    return (
        <></>
    );
};

export default FirstVerify;