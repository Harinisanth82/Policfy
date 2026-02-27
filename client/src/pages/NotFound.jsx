import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: ${({ theme }) => theme.bg || '#ffffff'};
    font-family: 'Poppins', sans-serif;
    text-align: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 50px;
    max-width: 1000px;
    width: 100%;
    z-index: 10;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 30px;
    }
`;

const ImageContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 400px;
`;

const TextContainer = styled.div`
    flex: 1;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 768px) {
        text-align: center;
        align-items: center;
    }
`;

const ErrorCode = styled.h1`
    font-size: 100px;
    font-weight: 700;
    color: ${({ theme }) => theme.primary || '#4285F4'}; /* Dark blue/Purple */
    margin: 0;
    line-height: 1;
`;

const ErrorTitle = styled.h2`
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary || '#000000'};
    margin: 0;
`;

const ErrorMessage = styled.p`
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary || '#666666'};
    margin: 0;
    max-width: 400px;
    line-height: 1.6;
`;

const HomeButton = styled.button`
    background: ${({ theme }) => theme.primary || '#4285F4'};
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 10px;
    width: fit-content;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
`;

// SVG Wire Illustration
const WireIllustration = () => {
    const theme = useTheme();
    const color = theme.primary || '#3f51b5';

    return (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Socket/Wall */}
            <circle cx="280" cy="50" r="8" fill="#FF5252" />
            <circle cx="260" cy="50" r="8" fill="#FFC107" />
            <circle cx="240" cy="50" r="8" fill="#4CAF50" />

            {/* Wire Path */}
            <path
                d="M150 50 C 150 150, 50 150, 50 200 C 50 250, 150 250, 150 300"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
            />

            {/* Plug Head (Simplified) */}
            <path d="M140 40 L160 40 L160 60 L140 60 Z" fill={color} />
            <rect x="145" y="25" width="4" height="15" fill="#333" />
            <rect x="151" y="25" width="4" height="15" fill="#333" />

            {/* Sparks/Disconnect */}
            <circle cx="150" cy="300" r="3" fill="#333" />
            <circle cx="140" cy="290" r="2" fill="#333" />
            <circle cx="160" cy="310" r="2" fill="#333" />
        </svg>
    );
};

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container>
            {/* Window Controls Decoration (Top Left) like the image */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5252' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFC107' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4CAF50' }}></div>
            </div>

            <ContentWrapper>
                <ImageContainer>
                    {/* Custom SVG Wire */}
                    <svg width="100%" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M350 40 C 350 40, 300 40, 300 80 C 300 120, 50 120, 50 180 C 50 240, 150 240, 150 280"
                            stroke="#3f51b5"
                            strokeWidth="10"
                            strokeLinecap="round"
                        />
                        {/* Plug at top */}
                        <path d="M340 10 L360 10 L360 40 L340 40 Z" fill="#3f51b5" />
                        {/* Prongs */}
                        <rect x="343" y="0" width="4" height="10" fill="#555" />
                        <rect x="353" y="0" width="4" height="10" fill="#555" />

                        {/* Frayed End at bottom */}
                        {/* Using small circles/dots for sparks */}
                        <circle cx="140" cy="285" r="3" fill="#333" opacity="0.6" />
                        <circle cx="160" cy="275" r="2" fill="#333" opacity="0.6" />
                        <circle cx="150" cy="295" r="2" fill="#333" opacity="0.6" />

                        {/* Shadow circle bg */}
                        <circle cx="100" cy="180" r="60" fill="#f0f0f0" z-index="-1" />
                    </svg>
                </ImageContainer>

                <TextContainer>
                    <ErrorCode>404</ErrorCode>
                    <ErrorTitle>Page Not Found</ErrorTitle>
                    <ErrorMessage>
                        We're sorry, the page you requested could not be found.
                        Please go back to the homepage.
                    </ErrorMessage>
                    <HomeButton onClick={() => navigate('/')}>
                        GO HOME
                    </HomeButton>
                </TextContainer>
            </ContentWrapper>
        </Container>
    );
};

export default NotFound;
