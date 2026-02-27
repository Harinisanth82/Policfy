import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";


const Button = styled.div`
  border-radius: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: min-content;
  padding: 16px 26px;
  box-shadow: 1px 20px 35px 0px ${({ theme }) => theme.primary + 40};
  border: 1px solid ${({ theme }) => theme.primary};
  
  @media (max-width: 600px) {
    padding: 8px 12px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.primary_hover || theme.primary};
    transform: translateY(-2px);
    box-shadow: 1px 25px 40px 0px ${({ theme }) => theme.primary + 50};
  }
  
  &:active {
    transform: translateY(0px);
    box-shadow: 1px 15px 30px 0px ${({ theme }) => theme.primary + 40};
  }

  ${({ type, theme }) =>
    type === "secondary"
      ? `
  background: ${theme.secondary};
  border: 1px solid ${({ theme }) => theme.secondary};
  `
      : `
  background: ${theme.primary};
`}

  ${({ isDisabled }) =>
    isDisabled &&
    `
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  `}
  ${({ isLoading }) =>
    isLoading &&
    `
    opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
`}
${({ flex }) =>
    flex &&
    `
    flex: 1;
`}

${({ small }) =>
    small &&
    `
padding: 10px 28px;
`}
  ${({ outlined, theme }) =>
    outlined &&
    `
background: transparent;
color: ${theme.primary};
  box-shadow: none;
  &:hover {
    background: ${theme.primary + 10};
    color: ${theme.primary};
    box-shadow: none;
  }
`}
  ${({ full }) =>
    full &&
    `
  width: 100%;`}
`;

const button = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type,
  onClick,
  flex,
  small,
  outlined,
  full,
}) => {
  return (
    <Button
      onClick={() => !isDisabled && !isLoading && onClick()}
      isDisabled={isDisabled}
      type={type}
      isLoading={isLoading}
      flex={flex}
      small={small}
      outlined={outlined}
      full={full}
    >
      {isLoading && (
        <CircularProgress
          style={{ width: "18px", height: "18px", color: "inherit" }}
        />
      )}
      {leftIcon}
      {text}
      {isLoading && <> . . .</>}
      {rightIcon}
    </Button>
  );
};

export default button;
