import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Save, Edit } from '@mui/icons-material';
import { getPolicyById, updatePolicy } from '../../api';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';


const Container = styled.div`
    padding: 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100vh;
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

const BackButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.text_primary};
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s ease;

    &:hover {
        background: ${({ theme }) => theme.text_secondary}20;
    }
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
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    @media (max-width: 768px) {
        padding: 24px; // Reduce padding on mobile
    }
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    grid-column: ${({ $fullWidth }) => $fullWidth ? '1 / -1' : 'auto'};
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

const Select = styled.select`
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text_primary};
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    cursor: pointer;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}15;
    }
`;

const TextArea = styled.textarea`
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text_primary};
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    min-height: 100px;
    resize: vertical;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}15;
    }
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
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

const EditPolicy = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [policyData, setPolicyData] = useState({
        title: '',
        category: '',
        premium: '',
        coverage: '',
        duration: '',
        isActive: true,
        description: ''
    });

    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true);
            try {
                const data = await getPolicyById(id);
                setPolicyData(data);
            } catch (error) {
                console.error("Error fetching policy:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Load Failed',
                    text: 'Failed to load policy details'
                });
                navigate('/admin/policies');
            } finally {
                setLoading(false);
            }
        };
        fetchPolicy();
    }, [id, navigate]);

    if (loading) {
        return <Loader />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPolicyData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePolicy(id, policyData);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Policy updated successfully',
                timer: 2000,
                showConfirmButton: false
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating policy:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update policy'
            });
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const cancelEdit = async () => {
        setIsEditing(false);
        try {
            const data = await getPolicyById(id);
            setPolicyData(data);
        } catch (error) {
            console.error("Error refetching policy:", error);
        }
    };

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate('/admin/policies')}>
                    <ArrowBack />
                </BackButton>
                <HeaderText>
                    <Title>{isEditing ? 'Edit Policy' : 'Policy Details'}</Title>
                    <Subtitle>{policyData.title || `Policy #${id}`}</Subtitle>
                </HeaderText>
                {!isEditing && (
                    <Button onClick={toggleEdit} style={{ marginLeft: 'auto' }}>
                        <Edit sx={{ fontSize: '18px' }} /> Edit Policy
                    </Button>
                )}
            </Header>

            <FormCard as="form" onSubmit={handleSubmit}>
                <FormGrid>
                    <FormGroup $fullWidth>
                        <Label>Policy Name</Label>
                        <Input
                            type="text"
                            name="title"
                            placeholder="e.g. Health Shield Plus"
                            value={policyData.title}
                            onChange={handleChange}
                            required
                            disabled={!isEditing}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Category</Label>
                        <Select
                            name="category"
                            value={policyData.category}
                            onChange={handleChange}
                            required
                            disabled={!isEditing}
                        >
                            <option value="">Select Category</option>
                            <option value="Health">Health</option>
                            <option value="Life">Life</option>
                            <option value="Auto">Auto</option>
                            <option value="Property">Property</option>
                            <option value="Travel">Travel</option>
                            <option value="Business">Business</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Status</Label>
                        <Select
                            name="isActive"
                            value={policyData.isActive}
                            onChange={(e) => setPolicyData({ ...policyData, isActive: e.target.value === 'true' })}
                            disabled={!isEditing}
                        >
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Premium Amount (₹/mo)</Label>
                        <Input
                            type="number"
                            name="premium"
                            placeholder="0.00"
                            value={policyData.premium}
                            onChange={handleChange}
                            required
                            disabled={!isEditing}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Coverage Amount (₹)</Label>
                        <Input
                            type="number"
                            name="coverage"
                            placeholder="0.00"
                            value={policyData.coverage}
                            onChange={handleChange}
                            required
                            disabled={!isEditing}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Duration (Years)</Label>
                        <Input
                            type="number"
                            name="duration"
                            placeholder="1"
                            value={policyData.duration}
                            onChange={handleChange}
                            required
                            disabled={!isEditing}
                        />
                    </FormGroup>

                    <FormGroup $fullWidth>
                        <Label>Description</Label>
                        <TextArea
                            name="description"
                            placeholder="Describe the policy benefits and terms..."
                            value={policyData.description}
                            onChange={handleChange}
                            required
                            disabled={!isEditing}
                        />
                    </FormGroup>
                </FormGrid>

                {isEditing && (
                    <Actions>
                        <Button type="button" onClick={cancelEdit}>
                            Cancel
                        </Button>
                        <Button type="submit" $primary>
                            <Save sx={{ fontSize: '18px' }} /> Save Changes
                        </Button>
                    </Actions>
                )}
            </FormCard>
        </Container>
    );
};

export default EditPolicy;
