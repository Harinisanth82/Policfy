import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + '50'};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TextInput = ({ label, placeholder, value, handelChange, password }) => {
    return (
        <Container>
            <Label>{label}</Label>
            <Input
                type={password ? 'password' : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={handelChange}
            />
        </Container>
    );
};

export default TextInput;
