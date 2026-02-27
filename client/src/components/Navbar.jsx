import React, { useState } from 'react';
import styled from 'styled-components';
import { Link as LinkR, NavLink } from 'react-router-dom';
import LightLogoImg from '../assets/images/logo.png';
import DarkLogoImg from '../assets/images/Dark_logo.jpg';
import { useTheme } from '../context/ThemeContext';
import { MenuRounded, DashboardRounded, PeopleRounded, PolicyRounded, AssignmentRounded, LogoutRounded } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../redux/userSlice';
import { useAuth } from '../context/AuthContext';

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  box-shadow: 0 4px 20px ${({ theme }) => theme.primary}20; /* Soft glow effect */
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  flex-wrap: nowrap;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  @media screen and (max-width: 768px) {
    padding: 0 12px;
    gap: 8px;
  }
`;

const NavLogo = styled(LinkR)`
  width: auto;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 6px;
  font-weight: 600;
  font-size: 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  white-space: nowrap;
  flex-shrink: 0;
  @media screen and (max-width: 768px) {
    gap: 6px;
    font-size: 16px;
    margin-right: auto;
  }
`;

const Logo = styled.img`
  height: 52px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  @media screen and (max-width: 768px) {
    height: 32px;
  }
`;

const Mobileicon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const NavItems = styled.ul`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 32px;
  padding: 0 6px;
  list-style: none;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 1s slide-in;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;

const UserContainer = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
`;

const LogoutButton = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 50px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.primary_hover || theme.primary};
  }
  @media screen and (max-width: 768px) {
    padding: 6px 14px;
    font-size: 14px;
    gap: 6px;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 2rem 0;
  list-style: none;
  width: 100%;
  position: fixed;
  top: 80px;
  left: 0;
  background: ${({ theme }) => theme.bg};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: all 0.6s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? "translateY(0)" : "translateY(-150%)")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  @media (min-width: 769px) {
    display: none;
  }
`;



const Navbar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [isOpen, setisOpen] = useState(false);


  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setisOpen(!isOpen)}>
          <MenuRounded sx={{ color: 'inherit' }} />
        </Mobileicon>
        <NavLogo to="/">
          <Logo src={isDarkMode ? DarkLogoImg : LightLogoImg} alt="Logo" />
          Policy Distributor
        </NavLogo>

        {/* <MobileMenu $isOpen={isOpen}> */}
        <MobileMenu $isOpen={isOpen}>
          {/* Admin Links */}
          <Navlink to="/admin/dashboard" onClick={() => setisOpen(false)}><DashboardRounded /> Dashboard</Navlink>
          <Navlink to="/admin/users" onClick={() => setisOpen(false)}><PeopleRounded /> Users</Navlink>
          <Navlink to="/admin/policies" onClick={() => setisOpen(false)}><PolicyRounded /> Policies</Navlink>
          <Navlink to="/admin/applications" onClick={() => setisOpen(false)}><AssignmentRounded /> Applications</Navlink>

          {/* User Links - Commented out
            <Navlink to="/user/dashboard" onClick={() => setisOpen(false)}><DashboardRounded /> Dashboard</Navlink>
            <Navlink to="/user/policies" onClick={() => setisOpen(false)}><PolicyRounded /> Policies</Navlink>
            <Navlink to="/user/my-applications" onClick={() => setisOpen(false)}><AssignmentRounded /> My Applications</Navlink>
            */}
        </MobileMenu>

        <NavItems>
          {/* Admin Links */}
          <Navlink to="/admin/dashboard"><DashboardRounded /> Dashboard</Navlink>
          <Navlink to="/admin/users"><PeopleRounded /> Users</Navlink>
          <Navlink to="/admin/policies"><PolicyRounded /> Policies</Navlink>
          <Navlink to="/admin/applications"><AssignmentRounded /> Applications</Navlink>

          {/* User Links - Commented out
            <Navlink to="/user/dashboard"><DashboardRounded /> Dashboard</Navlink>
            <Navlink to="/user/policies"><PolicyRounded /> Policies</Navlink>
            <Navlink to="/user/my-applications"><AssignmentRounded /> My Applications</Navlink>
            */}
        </NavItems>

        <UserContainer>
          <LogoutButton onClick={logout}>
            <LogoutRounded sx={{ fontSize: '1.2rem' }} /> Logout
          </LogoutButton>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
