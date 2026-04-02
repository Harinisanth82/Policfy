import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  min-height: 250px;
  gap: 20px;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
`;

const Ring = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 44px;
  height: 44px;
  margin: 3px;
  border: 3px solid ${({ theme }) => theme.primary || '#1976d2'};
  border-radius: 50%;
  animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${({ theme }) => theme.primary || '#1976d2'} transparent transparent transparent;

  &:nth-child(1) { animation-delay: -0.45s; }
  &:nth-child(2) { animation-delay: -0.3s; }
  &:nth-child(3) { animation-delay: -0.15s; }
`;

const BrandText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  letter-spacing: 3px;
  text-transform: uppercase;
  animation: ${fadeInOut} 2s ease-in-out infinite;
  user-select: none;
`;

const Loader = () => {
    return (
        <Container>
            <SpinnerWrapper>
                <Ring />
                <Ring />
                <Ring />
                <Ring />
            </SpinnerWrapper>
            <BrandText>Policfy</BrandText>
        </Container>
    );
};

export default Loader;
