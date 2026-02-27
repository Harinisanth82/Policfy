import React, { useState } from 'react';
import styled from 'styled-components';
import { Save } from '@mui/icons-material';
import { createAdmin } from '../../api';
import Swal from 'sweetalert2';



const Container = styled.div`
    padding: 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 100%;
    @media (max-width: 768px) {
        padding: 20px;
        gap: 16px;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;



const HeaderText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Title = styled.h1`
    font-size: 26px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
`;

const FormCard = styled.div`
    background: ${({ theme }) => theme.card};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.03);
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_secondary};
`;

const Input = styled.input`
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text_primary};
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}15;
    }
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.text_secondary}20;
    padding-top: 24px;
`;

const Button = styled.button`
    padding: 10px 24px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    ${({ $primary, theme }) => $primary ? `
        background-color: ${theme.primary};
        color: white;
        border: none;
        &:hover {
            background-color: ${theme.primary_hover || theme.primary};
        }
    ` : `
        background-color: transparent;
        color: ${theme.text_secondary};
        border: 1px solid ${theme.text_secondary}40;
        &:hover {
            background-color: ${theme.text_secondary}10;
            color: ${theme.text_primary};
        }
    `}
`;

const ErrorText = styled.div`
    color: #e53935;
    background-color: #ffebee;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 16px;
`;
const AddAdmin = () => {

    const [adminData, setAdminData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData(prev => ({
            ...prev,
            [name]: value
        }));

        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createAdmin(adminData);
            Swal.fire({
                title: "Success!",
                text: "Admin created successfully!",
                icon: "success",
                confirmButtonColor: "#007bff"
            });

        } catch (err) {
            console.error("Error creating admin:", err);
            setError(err.response?.data?.message || 'Failed to create admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Header>
                <HeaderText>
                    <Title>Add New Admin</Title>
                    <Subtitle>Create a new administrator account</Subtitle>
                </HeaderText>
            </Header>

            <FormCard as="form" onSubmit={handleSubmit}>
                {error && <ErrorText>{error}</ErrorText>}

                <FormGroup>
                    <Label>Email Address</Label>
                    <Input
                        type="email"
                        name="email"
                        placeholder="admin@example.com"
                        value={adminData.email}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Minimum 6 characters"
                        value={adminData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </FormGroup>

                <Actions>
                    <Button type="submit" $primary disabled={loading}>
                        <Save sx={{ fontSize: '18px' }} /> {loading ? 'Creating...' : 'Create Admin'}
                    </Button>
                </Actions>
            </FormCard>
        </Container>
    );
};

export default AddAdmin;
