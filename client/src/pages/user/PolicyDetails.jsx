import React from 'react';
import { useParams } from 'react-router-dom';

const PolicyDetails = () => {
    const { id } = useParams();
    return (
        <div>
            <h1>Policy Details {id}</h1>
        </div>
    );
};

export default PolicyDetails;
