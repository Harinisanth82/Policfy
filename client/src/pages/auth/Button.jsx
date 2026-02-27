import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';

const Btn = styled.div`
  padding: 0 24px;
  height: 50px;
  border-radius: ${({ rounded }) => rounded ? '50px' : '8px'};
  background: ${({ theme, isDisabled }) =>
        isDisabled ? theme.primary + '80' : theme.primary};
  color: white;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: ${({ isDisabled }) => isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${({ theme, isDisabled }) =>
        isDisabled ? theme.primary + '80' : theme.primary + 'dd'};
  }
`;

const Button = ({ text, onClick, isLoading, isDisabled, rounded, fullWidth }) => {
    return (
        <Btn onClick={!isDisabled && !isLoading ? onClick : undefined} isDisabled={isDisabled || isLoading} rounded={rounded} fullWidth={fullWidth}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : text}
        </Btn>
    );
};

export default Button;
