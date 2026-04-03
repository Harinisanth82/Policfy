import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, GppGood, CurrencyRupee } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addApplication, setApplications } from '../../redux/userSlice';
import { getAllPolicies, applyForPolicy, getUserApplications } from '../../api';
import Loader from '../../components/Loader';
import PolicyDetailsModal from './PolicyDetailsModal';

const Container = styled.div`
    padding: 22px 30px 30px 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
    min-height: 100vh;

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

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
    }
`;

const PolicyCard = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border: 2px solid ${({ theme }) => theme.text_secondary}40;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
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



const ViewPolicies = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                setError(false);
                const [policiesData, apps] = await Promise.all([
                    getAllPolicies(),
                    currentUser && currentUser._id ? getUserApplications(currentUser._id) : Promise.resolve([])
                ]);

                if (!Array.isArray(policiesData)) {
                    console.error("Expected array for policies, got:", policiesData);
                    setPolicies([]);
                    return;
                }

                const mappedPolicies = policiesData.map(p => {
                    const coverage = p.coverage ? (String(p.coverage).startsWith('₹') ? p.coverage : `₹${p.coverage}`) : '₹0';
                    const premium = p.premium ? (String(p.premium).startsWith('₹') ? p.premium : `₹${p.premium}`) : '₹0';

                    return {
                        id: p._id,
                        title: p.title || 'Untitled Policy',
                        category: p.category || 'General',
                        description: p.description || 'No description available.',
                        coverage: coverage,
                        premium: premium,
                        premiumVal: premium,
                        isActive: p.isActive,
                        analysis: p.analysis
                    };
                });
                setPolicies(mappedPolicies);

                if (Array.isArray(apps) && apps.length > 0) {
                    dispatch(setApplications(apps));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(true);
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

    if (error) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ color: 'red' }}>Server Unreachable</h2>
                    <p>We couldn't connect to the server. Please check your internet or try again later.</p>
                    <Button onClick={() => window.location.reload()} style={{ width: 'fit-content', margin: '0 auto', padding: '12px 24px' }}>
                        Retry Connection
                    </Button>
                </div>
            </Container>
        );
    }

    const filteredPolicies = policies.filter(policy =>
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (policy) => {
        setSelectedPolicy(policy);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedPolicy(null);
        document.body.style.overflow = 'auto';
    };

    const handleAnalyzeClick = () => {
        if (!selectedPolicy) return;
        closeModal();
        navigate(`/user/policy/${selectedPolicy.id}/analysis`);
    };

    const isApplied = selectedPolicy && currentUser?.applications?.some(app => {
        const appId = (app.policyId && typeof app.policyId === 'object') ? app.policyId._id : app.policyId;
        return String(appId) === String(selectedPolicy.id);
    });

    const handleApply = async () => {
        if (!selectedPolicy || isApplied) return;

        setIsApplying(true);

        try {
            const response = await applyForPolicy({
                userId: currentUser._id,
                policyId: selectedPolicy.id
            });

            if (response) {
                dispatch(addApplication(response));
            }

            setIsApplying(false);
            closeModal();
        } catch (error) {
            console.error("Error applying for policy:", error);
            const message = error.response?.data?.message || "Failed to apply for policy";
            alert(message);

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
            <PolicyDetailsModal
                selectedPolicy={selectedPolicy}
                closeModal={closeModal}
                handleAnalyzeClick={handleAnalyzeClick}
                handleApply={handleApply}
                isApplied={isApplied}
                isApplying={isApplying}
            />
        </Container>
    );
};

export default ViewPolicies;
