import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MenuRounded, LogoutRounded, PersonRounded, DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import LightLogoImg from '../assets/images/logo.png';
import DarkLogoImg from '../assets/images/Dark_logo.jpg';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
    display: flex;
    background: ${({ theme }) => theme.bgLight};
    height: 100vh;
    overflow: hidden;
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; // Prevent wrapper from scrolling
    height: 100%;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 30px;
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '20'};
    z-index: 10;
    
    @media (max-width: 768px) {
        padding: 16px 20px;
    }
`;

const HeaderTitle = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    display: flex;
    align-items: center;
    gap: 12px;
    
    @media (max-width: 768px) {
        font-size: 16px;
        gap: 8px;
    }
`;

const LogoIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const Logo = styled.img`
    height: 32px;
    width: auto;
    object-fit: contain;
    @media (min-width: 769px) {
        height: 48px;
    }
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    
    @media (max-width: 768px) {
        gap: 10px;
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ theme }) => theme.text_secondary + '20'};
    padding: 6px 16px;
    border: 1px solid ${({ theme }) => theme.text_secondary + '35'};
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
    
    @media (max-width: 768px) {
        display: none;
    }
`;

const UserIcon = styled.div`
    width: 32px;
    height: 32px;
    background-color: ${({ theme }) => theme.primary};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LogoutBtn = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #F60000; // OnePlus Red
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 8px 16px; 
    border: 2px solid #F60000; // OnePlus Red
    border-radius: 8px; 
    transition: all 0.2s ease;
    background: transparent;

    &:hover {
        background: #F60000; // OnePlus Red
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(246, 0, 0, 0.4);
    }
    
    @media (max-width: 768px) {
        padding: 6px 12px;
        font-size: 12px;
        border-width: 1.5px;
        gap: 4px;
    }
`;

const ThemeToggleBtn = styled.div`
    cursor: pointer;
    color: ${({ theme }) => theme.text_primary};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${({ theme }) => theme.text_secondary + '20'};
    }
`;

const MenuButton = styled.div`
    cursor: pointer;
    color: ${({ theme }) => theme.text_primary};
    display: none;
    align-items: center;
    
    @media (max-width: 768px) {
        display: flex;
    }
`;

const ContentArea = styled.div`
    padding: 0; // Removed padding to prevent double spacing with page containers
    flex: 1;
    overflow-y: auto; // Allow content to scroll
    height: 100%; // Ensure it takes full height
    @media (max-width: 768px) {
        padding: 0;
    }
`;

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const { logout } = useAuth();
    const { toggleTheme, isDarkMode } = useTheme();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Container>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <ContentWrapper>
                <Header>
                    <HeaderTitle>
                        <MenuButton onClick={toggleSidebar}>
                            <MenuRounded />
                        </MenuButton>
                        <LogoIcon>
                            <Logo src={isDarkMode ? DarkLogoImg : LightLogoImg} alt="Logo" />
                        </LogoIcon>
                        Policy Distributor
                    </HeaderTitle>

                    <UserSection>
                        <ThemeToggleBtn onClick={toggleTheme}>
                            {isDarkMode ? <LightModeRounded sx={{ fontSize: '20px' }} /> : <DarkModeRounded sx={{ fontSize: '20px' }} />}
                        </ThemeToggleBtn>
                        {currentUser && (
                            <UserInfo>
                                <UserIcon>
                                    <PersonRounded sx={{ fontSize: '20px' }} />
                                </UserIcon>
                                {currentUser.email || currentUser.name || 'User'}
                            </UserInfo>
                        )}
                        <LogoutBtn onClick={logout}>
                            <LogoutRounded sx={{ fontSize: '20px' }} />
                            Logout
                        </LogoutBtn>
                    </UserSection>
                </Header>
                <ContentArea>
                    <Outlet />
                </ContentArea>
            </ContentWrapper>
        </Container>
    );
};

export default MainLayout;
