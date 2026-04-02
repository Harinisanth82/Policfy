import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { applyForPolicy, generatePolicyForm } from '../../api';
import { useSelector, useDispatch } from 'react-redux';
import { addApplication } from '../../redux/userSlice';
import Swal from 'sweetalert2';
import { ArrowBack, AssignmentTurnedIn, AutoAwesome } from '@mui/icons-material';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'toast-below-nav'
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const pulse = keyframes`
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
`;

const Container = styled.div`
    padding: 30px 40px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 32px;
    font-family: 'Poppins', sans-serif;
    
    @media (max-width: 768px) {
        padding: 20px;
        gap: 24px;
    }
`;

const BackNav = styled.div`
    position: sticky;
    top: 24px;
    z-index: 100;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.text_primary};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
    
    /* Liquid Glass design */
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 12px 24px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

    margin: -10px 0 32px 0;

    &:hover {
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const Subtitle = styled.p`
    font-size: 15px;
    color: ${({ theme }) => theme.text_secondary};
    margin: 0;
    max-width: 800px;
    line-height: 1.5;
`;

const FormCard = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 24px;
    border: 1px solid ${({ theme }) => theme.text_secondary}20;
    max-width: 800px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
`;

const Input = styled.input`
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    font-family: inherit;
    font-size: 15px;
    color: ${({ theme }) => theme.text_primary};
    background: ${({ theme }) => theme.bgLight || '#f9fafb'};
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
        background: ${({ theme }) => theme.bg || '#ffffff'};
    }
`;

const SubmitButton = styled.button`
    padding: 14px 24px;
    background: ${({ theme }) => theme.primary || '#1976d2'};
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s ease;
    margin-top: 10px;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px ${({ theme }) => theme.primary}40;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const GeneratingState = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${({ theme }) => theme.primary};
    font-style: italic;
    font-weight: 500;
    animation: ${pulse} 2s infinite ease-in-out;
    background: ${({ theme }) => theme.primary}10;
    padding: 16px;
    border-radius: 12px;
`;

const GetDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    
    const policy = location.state?.policy;
    
    const [formData, setFormData] = useState({});
    const [fieldsToRender, setFieldsToRender] = useState([]);
    const [isGenerating, setIsGenerating] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!policy) return;

        const fetchDynamicFields = async () => {
            try {
                const data = await generatePolicyForm({
                    title: policy.title,
                    description: policy.description
                });
                
                if (data.fields && Array.isArray(data.fields)) {
                    setFieldsToRender(data.fields);
                } else {
                    throw new Error("Invalid response");
                }
            } catch (error) {
                console.error("AI Generation failed:", error);
                setFieldsToRender([
                    { name: 'age', label: 'Applicant Age', type: 'number', required: true, placeholder: 'e.g. 35' },
                    { name: 'occupation', label: 'Current Occupation', type: 'text', required: true, placeholder: 'e.g. Self-employed' },
                    { name: 'annualIncome', label: 'Annual Income (₹)', type: 'number', required: true, placeholder: 'e.g. 1500000' },
                    { name: 'purpose', label: 'Primary purpose for this insurance', type: 'text', required: true, placeholder: 'e.g. Personal protection' }
                ]);
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'warning',
                    title: 'AI form creation delayed. Using standard form.',
                    showConfirmButton: false,
                    timer: 3000
                });
            } finally {
                setIsGenerating(false);
            }
        };

        fetchDynamicFields();
    }, [policy]);

    if (!policy) {
        return (
            <Container>
                <BackNav onClick={() => navigate('/user/policies')}>
                    <ArrowBack fontSize="small" /> Back to Policies
                </BackNav>
                <h2>Policy details not found. Please navigate from the View Policies page.</h2>
            </Container>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        for (let field of fieldsToRender) {
            if (field.required && !formData[field.name]) {
                Swal.fire({
                    icon: 'error',
                    title: 'Missing Field',
                    text: `Please provide a value for: ${field.label}`
                });
                return;
            }
        }

        setIsSubmitting(true);
        
        try {
            const applicationPayload = {
                userId: currentUser._id,
                policyId: policy.id || policy._id,
                customDetails: formData
            };

            const data = await applyForPolicy(applicationPayload);
            dispatch(addApplication(data));

            Toast.fire({
                icon: 'success',
                title: 'Application Submitted!'
            }).then(() => {
                navigate('/user/my-applications');
            });
            
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || 'Submission Failed'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <BackNav onClick={() => navigate(-1)}>
                <ArrowBack fontSize="small" /> Go Back
            </BackNav>
            
            <Header>
                <Title>Application Details: {policy.category}</Title>
                <Subtitle>We need a few specific details about you to process your application for the <strong>{policy.title}</strong>.</Subtitle>
            </Header>

            <FormCard>
                {isGenerating ? (
                    <GeneratingState>
                        <AutoAwesome fontSize="small" /> Policfy AI is analyzing the policy constraints and generating the required application form...
                    </GeneratingState>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {fieldsToRender.map((field) => (
                            <FormGroup key={field.name}>
                                <Label>
                                    {field.label} {field.required && <span style={{ color: '#d32f2f' }}>*</span>}
                                </Label>
                                <Input 
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    min={field.type === 'number' ? "0" : undefined}
                                />
                            </FormGroup>
                        ))}

                        <SubmitButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting Application...' : (
                                <>
                                    <AssignmentTurnedIn fontSize="small" /> Submit Application
                                </>
                            )}
                        </SubmitButton>
                    </form>
                )}
            </FormCard>
        </Container>
    );
};

export default GetDetails;
