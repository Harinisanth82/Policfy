import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import {
    DashboardRounded,
    PolicyRounded,
    AssignmentRounded,
    CloseRounded,
    PeopleRounded,
    PersonAddRounded
} from '@mui/icons-material';
import LightLogoImg from '../assets/images/logo.png';
import DarkLogoImg from '../assets/images/Dark_logo.jpg';
import { useTheme } from '../context/ThemeContext';


const SidebarContainer = styled.div`
    flex: 0 0 250px;
    background-color: ${({ theme }) => theme.bg || '#ffffff'};
    height: 100vh;
    display: flex;
    flex-direction: column;
    border-right: 1px solid ${({ theme }) => theme.text_secondary + '20'};
    position: sticky;
    top: 0;
    transition: all 0.3s ease;
    z-index: 1000;

    @media (max-width: 768px) {
        position: fixed;
        left: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
        width: 250px;
        box-shadow: ${({ $isOpen }) => ($isOpen ? '4px 0 20px rgba(0,0,0,0.1)' : 'none')};
    }
`;

const LogoSection = styled.div`
    padding: 30px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    border-bottom: 1px solid ${({ theme }) => theme.text_secondary}15;
`;

const PanelTitle = styled.div`
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.text_primary};
    letter-spacing: -0.5px;
    text-transform: capitalize;
`;

const RoleBadge = styled.div`
    padding: 4px 10px;
    background: ${({ $isAdmin, theme }) => $isAdmin ? '#ef535015' : theme.primary + '15'};
    color: ${({ $isAdmin, theme }) => $isAdmin ? '#ef5350' : theme.primary};
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: fit-content;
    margin-top: 4px;
`;


const NavMenu = styled.div`
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

const MenuLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border-radius: 12px;
    text-decoration: none;
    color: ${({ theme }) => theme.text_secondary};
    font-weight: 500;
    font-size: 14px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &:hover {
        background-color: ${({ theme }) => theme.primary + '08'};
        color: ${({ theme }) => theme.primary};
        transform: translateX(4px);
    }

    &.active {
        background: ${({ theme }) => `linear-gradient(90deg, ${theme.primary}15 0%, ${theme.primary}05 100%)`};
        color: ${({ theme }) => theme.primary};
        font-weight: 700;
        
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 20%;
            bottom: 20%;
            width: 4px;
            background: ${({ theme }) => theme.primary};
            border-radius: 0 4px 4px 0;
            box-shadow: 2px 0 8px ${({ theme }) => theme.primary}60;
        }

        svg {
            color: ${({ theme }) => theme.primary};
            filter: drop-shadow(0 0 4px ${({ theme }) => theme.primary}40);
        }
    }

    svg {
        font-size: 22px;
        transition: all 0.2s ease;
    }
`;



const CloseButton = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    display: none;
    color: ${({ theme }) => theme.text_secondary};
    
    @media (max-width: 768px) {
        display: block;
    }
`;

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { currentUser } = useSelector(state => state.user);
    const { isDarkMode } = useTheme();
    const role = currentUser?.role || 'user';

    return (
        <SidebarContainer $isOpen={isOpen}>
            <LogoSection>
                <PanelTitle>
                    {role} Panel
                </PanelTitle>
                <RoleBadge $isAdmin={role === 'admin'}>
                    {role === 'admin' ? 'Administrator' : 'Safe Member'}
                </RoleBadge>
            </LogoSection>

            <CloseButton onClick={toggleSidebar}>
                <CloseRounded />
            </CloseButton>

            <NavMenu>

                {role === 'admin' && (
                    <>
                        <MenuLink to="/admin/dashboard" onClick={toggleSidebar}>
                            <DashboardRounded sx={{ fontSize: '20px' }} />
                            Dashboard
                        </MenuLink>
                        <MenuLink to="/admin/users" onClick={toggleSidebar}>
                            <PeopleRounded sx={{ fontSize: '20px' }} />
                            Members
                        </MenuLink>
                        <MenuLink to="/admin/policies" onClick={toggleSidebar}>
                            <PolicyRounded sx={{ fontSize: '20px' }} />
                            Policies
                        </MenuLink>
                        <MenuLink to="/admin/applications" onClick={toggleSidebar}>
                            <AssignmentRounded sx={{ fontSize: '20px' }} />
                            Applications
                        </MenuLink>
                        <MenuLink to="/admin/add-admin" onClick={toggleSidebar}>
                            <PersonAddRounded sx={{ fontSize: '20px' }} />
                            Add Admin
                        </MenuLink>
                    </>
                )}


                {role === 'user' && (
                    <>
                        <MenuLink to="/user/dashboard" onClick={toggleSidebar}>
                            <DashboardRounded sx={{ fontSize: '20px' }} />
                            Dashboard
                        </MenuLink>
                        <MenuLink to="/user/policies" onClick={toggleSidebar}>
                            <PolicyRounded sx={{ fontSize: '20px' }} />
                            Policies
                        </MenuLink>
                        <MenuLink to="/user/my-applications" onClick={toggleSidebar}>
                            <AssignmentRounded sx={{ fontSize: '20px' }} />
                            My Applications
                        </MenuLink>
                    </>
                )}
            </NavMenu>

        </SidebarContainer>
    );
};

export default Sidebar;
