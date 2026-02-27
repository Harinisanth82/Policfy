import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, GppGood, CurrencyRupee, CloseRounded } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addApplication, setApplications } from '../../redux/userSlice';
import { getAllPolicies, applyForPolicy, getUserApplications } from '../../api';
import Loader from '../../components/Loader';

const Container = styled.div`
    padding: 22px 30px 30px 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;

    @media (max-width: 768px) {
        padding: 20px;
        gap: 20px;
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const Title = styled.h1`
    font-size: 26px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
    margin: 0;
`;

const SearchContainer = styled.div`
    background: ${({ theme }) => theme.bgLight || '#f8f9fa'};
    border: 1px solid ${({ theme }) => theme.text_secondary + '60'};
    border-radius: 12px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 600px;
    width: 100%;
    
    &:focus-within {
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.primary + '20'};
    }
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: ${({ theme }) => theme.text_primary};
    width: 100%;

    &::placeholder {
        color: ${({ theme }) => theme.text_secondary};
    }
`;

const PoliciesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
`;

const PolicyCard = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border: 2px solid ${({ theme }) => theme.text_secondary}40; /* Thicker and darker border */
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%; /* Ensure full height */
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* Stronger hover shadow */
        border-color: ${({ theme }) => theme.primary};
    }
`;

const CardHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
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

const PolicyTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const PolicyDescription = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
    line-height: 1.6;
    margin: 0;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const FullPolicyDescription = styled.p`
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
`;

const Divider = styled.div`
    height: 1px;
    background: ${({ theme }) => theme.text_secondary + '15'};
    margin: 4px 0;
`;

const DetailsRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid ${({ theme }) => theme.text_secondary + '10'};
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
    font-weight: 500;
`;

const Price = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
`;

const Button = styled.button`
    background: ${({ theme }) => theme.primary};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    width: 100%;

    &:hover {
        background: ${({ theme }) => theme.primary_hover};
    }
`;

const ActionsRow = styled.div`
    margin-top: auto;
    padding-top: 12px;
`;

// --- Modal Styles ---
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
    max-width: 500px; /* Reduces max width for smaller screens */
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    max-height: 80vh; /* Reduces height on mobile */
    overflow-y: auto;
    overflow-x: hidden; /* Prevents horizontal scroll */
    
    @media (max-width: 768px) {
        padding: 20px;
        width: 85%; /* Slightly smaller width */
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

const ViewPolicies = () => {
    // const navigate = useNavigate(); // Not needed if we use modal
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);

    // Fetch policies on mount
    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [policiesData, apps] = await Promise.all([
                    getAllPolicies(),
                    currentUser && currentUser._id ? getUserApplications(currentUser._id) : Promise.resolve([])
                ]);

                // Map backend data to frontend structure if needed
                const mappedPolicies = policiesData.map(p => ({
                    id: p._id, // Use _id for backend
                    title: p.title,
                    category: p.category,
                    description: p.description,
                    coverage: `₹${p.coverage}`,
                    premium: `₹${p.premium}/mo`,
                    premiumVal: `₹${p.premium}`,
                    isActive: p.isActive,
                    color: '#1976d2', // Default color for now
                    bg: '#e3f2fd'    // Default bg for now
                }));
                setPolicies(mappedPolicies);

                if (apps.length > 0) {
                    dispatch(setApplications(apps));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?._id, dispatch]);

    if (loading) {
        return <Loader />;
    }

    const filteredPolicies = policies.filter(policy =>
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (policy) => {
        setSelectedPolicy(policy);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setSelectedPolicy(null);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };



    const isApplied = selectedPolicy && currentUser?.applications?.some(app => {
        const appId = (app.policyId && typeof app.policyId === 'object') ? app.policyId._id : app.policyId;
        return appId === selectedPolicy.id;
    });

    const handleApply = async () => {
        if (!selectedPolicy || isApplied) return;

        setIsApplying(true);

        try {
            const response = await applyForPolicy({
                userId: currentUser._id,
                policyId: selectedPolicy.id
            });

            // Dispatch to redux to update UI state
            if (response) {
                dispatch(addApplication(response));
            }

            // alert("Application submitted successfully!");
            setIsApplying(false);
            // closeModal();
        } catch (error) {
            console.error("Error applying for policy:", error);
            const message = error.response?.data?.message || "Failed to apply for policy";
            alert(message);

            // Fetch latest applications to ensure UI is in sync (e.g., if already applied)
            if (currentUser && currentUser._id) {
                try {
                    const apps = await getUserApplications(currentUser._id);
                    dispatch(setApplications(apps));
                } catch (err) {
                    console.error("Error syncing applications:", err);
                }
            }

            setIsApplying(false);
        }
    };

    return (
        <Container>
            <Header>
                <Title>Available Policies</Title>
                <Subtitle>Browse and apply for insurance policies.</Subtitle>
            </Header>

            <SearchContainer>
                <Search sx={{ color: 'inherit', opacity: 0.5 }} />
                <SearchInput
                    placeholder="Search policies by name, category, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchContainer>

            <PoliciesGrid>
                {filteredPolicies.map((policy) => (
                    <PolicyCard key={policy.id}>
                        <CardHeader>
                            <PolicyTitle>{policy.title}</PolicyTitle>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <Tag>{policy.category}</Tag>
                            </div>
                            <PolicyDescription>{policy.description}</PolicyDescription>
                            <Divider />
                            <DetailsRow>
                                <DetailItem>
                                    <GppGood sx={{ fontSize: 20 }} /> Coverage
                                </DetailItem>
                                <Price>{policy.coverage}</Price>
                            </DetailsRow>
                            <DetailsRow style={{ borderTop: 'none', paddingTop: '4px' }}>
                                <DetailItem>
                                    <CurrencyRupee sx={{ fontSize: 20 }} /> Premium
                                </DetailItem>
                                <Price>{policy.premium}</Price>
                            </DetailsRow>
                            <ActionsRow>
                                <Button onClick={() => openModal(policy)}>
                                    View Details
                                </Button>
                            </ActionsRow>
                        </CardHeader>
                    </PolicyCard>
                ))}
            </PoliciesGrid>

            {/* Modal */}
            {selectedPolicy && (
                <Overlay onClick={closeModal}>
                    <ModalContainer onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{selectedPolicy.title}</ModalTitle>
                            <CloseIcon onClick={closeModal} />
                        </ModalHeader>

                        <ModalContent>
                            <Tag>{selectedPolicy.category}</Tag>

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
                                onClick={handleApply}
                                disabled={isApplied || isApplying}
                                style={{
                                    opacity: (isApplied || isApplying) ? 0.7 : 1,
                                    cursor: (isApplied || isApplying) ? 'not-allowed' : 'pointer',
                                    backgroundColor: isApplied ? '#d32f2f' : null // Red if applied
                                }}
                            >
                                {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply Now'}
                            </PrimaryButton>
                        </ModalActions>
                    </ModalContainer>
                </Overlay>
            )}
        </Container>
    );
};

export default ViewPolicies;
