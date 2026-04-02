import React from 'react';
import styled from 'styled-components';
import { CloseRounded, AutoAwesome } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
`;

const ModalContainer = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    width: 90%;
    max-width: 500px;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
    
    @media (max-width: 768px) {
        padding: 16px;
        width: 95%;
        max-height: 85vh;
        gap: 16px;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const ModalTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const CloseIcon = styled(CloseRounded)`
    cursor: pointer;
    color: ${({ theme }) => theme.text_secondary};
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.text_primary};
    }
`;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Tag = styled.div`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
    background: ${({ theme }) => theme.primary + '15'};
    color: ${({ theme }) => theme.primary};
`;

const AnalyzeButton = styled.button`
    padding: 6px 14px;
    background: ${({ theme }) => theme.primary || '#1a73e8'};
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 12px rgba(26, 115, 232, 0.2);

    &:hover {
        background: ${({ theme }) => theme.primary_hover || '#1557b0'};
        box-shadow: 0 6px 16px rgba(26, 115, 232, 0.3);
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(26, 115, 232, 0.15);
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
        padding: 10px;
    }
`;

const TagRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const FullPolicyDescription = styled.p`
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
`;



const StatBoxRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
`;

const StatBox = styled.div`
    background: ${({ theme }) => theme.bgLight || '#f8f9fa'};
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StatLabel = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.text_secondary};
`;

const StatValue = styled.div`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
`;

const ModalActions = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 10px;
`;

const SecondaryButton = styled.button`
    flex: 1;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.text_secondary + '40'};
    color: ${({ theme }) => theme.text_primary};
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${({ theme }) => theme.bgLight || '#f5f5f5'};
        border-color: ${({ theme }) => theme.text_secondary};
    }
`;

const PrimaryButton = styled.button`
    flex: 1;
    background: ${({ theme }) => theme.primary};
    border: none;
    color: white;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: ${({ theme }) => theme.primary_hover};
    }
`;

const PolicyDetailsModal = ({
    selectedPolicy,
    closeModal,
    handleAnalyzeClick,
    isApplied
}) => {
    const navigate = useNavigate();

    if (!selectedPolicy) return null;

    const handleApplyRedirect = () => {
        closeModal();
        navigate(`/user/policy/${selectedPolicy._id}/getdetails`, { state: { policy: selectedPolicy } });
    };

    return (
        <Overlay onClick={closeModal}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>{selectedPolicy.title}</ModalTitle>
                    <CloseIcon onClick={closeModal} />
                </ModalHeader>

                <ModalContent>
                    <TagRow>
                        <Tag>{selectedPolicy.category}</Tag>
                        <AnalyzeButton onClick={handleAnalyzeClick}>
                            <AutoAwesome fontSize="small" /> Analyze Policy Risk (AI)
                        </AnalyzeButton>
                    </TagRow>

                    <FullPolicyDescription>
                        {selectedPolicy.description}
                    </FullPolicyDescription>



                    <StatBoxRow>
                        <StatBox>
                            <StatLabel>Coverage Amount</StatLabel>
                            <StatValue>{selectedPolicy.coverage}</StatValue>
                        </StatBox>
                        <StatBox>
                            <StatLabel>Monthly Premium</StatLabel>
                            <StatValue>{selectedPolicy.premiumVal || selectedPolicy.premium}</StatValue>
                        </StatBox>
                    </StatBoxRow>
                </ModalContent>

                <ModalActions>
                    <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
                    <PrimaryButton
                        onClick={handleApplyRedirect}
                        disabled={isApplied}
                        style={{
                            opacity: isApplied ? 0.7 : 1,
                            cursor: isApplied ? 'not-allowed' : 'pointer',
                            backgroundColor: isApplied ? '#d32f2f' : null
                        }}
                    >
                        {isApplied ? 'Applied' : 'Apply Now'}
                    </PrimaryButton>
                </ModalActions>
            </ModalContainer>
        </Overlay>
    );
};

export default PolicyDetailsModal;
