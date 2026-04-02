import React, { useState, useEffect } from 'react';
import styled, { keyframes } from "styled-components";
import Signup from './Signup';
import Login from './Login';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';

const Container = styled.div`
    flex: 1;
    height: 100vh;
    display: flex;
    background: ${({ theme }) => theme.bg};
    @media (max-width: 900px) {
        flex-direction: column;
    }
`;

const Left = styled.div`
    flex: 1;
    position: relative;
    background-color: #000408;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    @media (max-width: 900px) {
        display: none;
    }
`;

const Right = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40px;
    gap: 16px;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.bg};
    overflow-y: auto;
    z-index: 100;

    @media (max-width: 600px) {
        padding: 24px 30px;
    }
`;

const ThemeToggle = styled.div`
    position: absolute;
    top: 24px;
    right: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 50px;
    background: ${({ theme }) => theme.text_secondary + '10'};
    border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
    color: ${({ theme }) => theme.text_primary};
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    z-index: 100;

    &:hover {
        background: ${({ theme }) => theme.text_secondary + '20'};
        transform: translateY(-2px);
    }
`;

// --- BACKGROUND GRID ---
const BackgroundGrid = styled.div`
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(25, 118, 210, 0.15) 1.5px, transparent 1px);
    background-size: 40px 40px;
    z-index: 1;
`;

// --- MASCOT ANIMATIONS ---

const floatRobot = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
`;

const floatHands = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(15deg); }
`;

const floatCloud = keyframes`
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-8px) scale(1.03); }
`;

const fadeText = keyframes`
    0% { opacity: 0; transform: translateY(5px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-5px); }
`;

// --- MASCOT ELEMENTS ---

const MascotWrapper = styled.div`
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 150px; /* Offset to center the whole composition (robot + cloud) */
`;

const Head = styled.div`
    width: 170px;
    height: 120px;
    background: #ffffff;
    border-radius: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 35px rgba(0,0,0,0.6), inset 0 -6px 15px rgba(0,0,0,0.1);
    animation: ${floatRobot} 4s ease-in-out infinite;
    position: relative;
    z-index: 5;

    /* Antenna Pole */
    &::before {
        content: '';
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 25px;
        background: #90caf9;
        border-radius: 4px;
    }

    /* Antenna Glow */
    &::after {
        content: '';
        position: absolute;
        top: -38px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 16px;
        background: #00e676;
        border-radius: 50%;
        box-shadow: 0 0 20px #00e676;
    }
`;

const blink = keyframes`
    0%, 96%, 98% { transform: scaleY(1); }
    97% { transform: scaleY(0.1); }
`;

const Visor = styled.div`
    width: 140px;
    height: 75px;
    background: #000a12;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: flex-end; /* Pushes eyes to the right! */
    padding-right: 25px;
    box-shadow: inset 0 6px 15px rgba(255,255,255,0.2);
`;

const Eyes = styled.div`
    display: flex;
    gap: 14px;
    animation: ${blink} 5s infinite;

    &::before, &::after {
        content: '';
        width: 18px;
        height: 18px;
        background: #00e676;
        border-radius: 50%;
        box-shadow: 0 0 15px #00e676;
    }
`;

const Body = styled.div`
    width: 110px;
    height: 90px;
    background: linear-gradient(135deg, #1976d2, #0d47a1);
    border-radius: 30px 30px 45px 45px;
    margin-top: -15px;
    position: relative;
    animation: ${floatRobot} 4s ease-in-out infinite;
    animation-delay: 0.15s;
    box-shadow: 0 20px 40px rgba(25, 118, 210, 0.4), inset 0 8px 12px rgba(255,255,255,0.3);
    z-index: 4;
`;

const Hand = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    top: 25px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
    animation: ${floatHands} 4s ease-in-out infinite;
    z-index: 6;
`;

const LeftHand = styled(Hand)`
    left: -50px;
    animation-delay: 0.2s;
`;

const RightHand = styled(Hand)`
    right: -50px;
    animation-delay: 0.4s;
`;

// Literal CSS Cloud Shape
const Cloud = styled.div`
    position: absolute;
    top: -150px;
    right: -280px;
    width: 300px;
    height: 100px;
    background: white;
    border-radius: 50px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
    animation: ${floatCloud} 5s ease-in-out infinite;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30px;

    /* Speech Pointer */
    &::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 50px;
        border-width: 25px 25px 0 0;
        border-style: solid;
        border-color: white transparent transparent transparent;
    }
    
    /* Cloud Bumps */
    &::before {
        content: '';
        position: absolute;
        top: -30px;
        left: 40px;
        width: 100px;
        height: 100px;
        background: white;
        border-radius: 50%;
        box-shadow: 60px -20px 0 20px white, 130px 10px 0 -10px white;
        z-index: -1;
    }
`;

const SuggestionText = styled.div`
    color: #1976d2;
    font-weight: 700;
    font-size: 16px;
    text-align: center;
    line-height: 1.4;
    z-index: 5;
    animation: ${fadeText} 6s ease-in-out infinite;
`;


// --- LOGIC ---

const suggestionsList = [
    "Hi there! Need to secure your future? Just log in! ✨",
    "I'm Policfy Bot. I analyze risks so you don't have to!",
    "Looking for the best policy? You are absolutely in the right place! 🛡️",
    "Welcome back! Your dashboard is fully updated."
];

const MascotShowcase = () => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(i => (i + 1) % suggestionsList.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Left>
            <BackgroundGrid />
            <MascotWrapper>
                <Cloud>
                    <SuggestionText key={msgIndex}>
                        {suggestionsList[msgIndex]}
                    </SuggestionText>
                </Cloud>
                
                <Head>
                    <Visor>
                        <Eyes />
                    </Visor>
                </Head>
                
                <Body>
                    <LeftHand />
                    <RightHand />
                </Body>
            </MascotWrapper>
        </Left>
    );
};

// --- WIRING ---

const Authentication = () => {
    const location = useLocation();
    const isSignup = location.pathname === '/signup';
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <Container>
            <MascotShowcase />
            <Right>
                <ThemeToggle onClick={toggleTheme}>
                    {isDarkMode ? (
                        <>
                            <LightModeRounded sx={{ fontSize: '20px' }} />
                            Light
                        </>
                    ) : (
                        <>
                            <DarkModeRounded sx={{ fontSize: '20px' }} />
                            Dark
                        </>
                    )}
                </ThemeToggle>
                {isSignup ? (
                    <Signup />
                ) : (
                    <Login />
                )}
            </Right>
        </Container>
    );
};

export default Authentication;
