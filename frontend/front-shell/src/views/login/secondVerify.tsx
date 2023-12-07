import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {secondVerificationRequest} from "../../utils/publicRequests";

const SecondVerify = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    useEffect(() => {
        if (id) {
            secondVerificationRequest(id).then(() => {
                return navigate(`/`)
            })
        }
    }, [id])
    return (
        <></>
    );
};

export default SecondVerify;