import React from 'react';
import styled from "styled-components";

import AuthImageRaw from "../../assets/images/auth_cover.jpg";
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
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Left = styled.div`
    flex: 1;
    position: relative;
    @media (max-width: 768px) {
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
    overflow-y: auto; // Added just in case
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
    transition: all 0.2s ease;
    z-index: 100;

    &:hover {
        background: ${({ theme }) => theme.text_secondary + '20'};
    }

    @media (max-width: 768px) {
        top: 16px;
        right: 16px;
    }
`;



const Image = styled.div`
    background-image: url(${AuthImageRaw});
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
`;

const Authentication = () => {
    const location = useLocation();
    const isSignup = location.pathname === '/signup';
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <Container>
            <Left>
                <Image />
            </Left>
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
