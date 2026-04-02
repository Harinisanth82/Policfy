import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getPolicyById, analyzePolicyApi, applyForPolicy, getUserApplications } from '../../api';
import { addApplication, setApplications } from '../../redux/userSlice';
import { GppGood, CurrencyRupee, ArrowBack } from '@mui/icons-material';
import Loader from '../../components/Loader';

const Container = styled.div`
    padding: 22px 30px 30px 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 30px;
    min-height: 100vh;

    @media (max-width: 768px) {
        padding: 20px;
        gap: 20px;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
    }
`;

const TitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
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

const Title = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
    
    @media (max-width: 768px) {
        font-size: 24px;
    }
`;

const Tag = styled.div`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    width: fit-content;
    background: ${({ theme }) => theme.primary + '15'};
    color: ${({ theme }) => theme.primary};
`;

const PolicyCard = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border: 2px solid ${({ theme }) => theme.text_secondary}40;
    border-radius: 16px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 100%;
`;

const FullPolicyDescription = styled.p`
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
    line-height: 1.7;
    margin: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
`;

const DetailsRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid ${({ theme }) => theme.text_secondary + '15'};
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
    font-weight: 600;
`;

const Price = styled.div`
    font-size: 22px;
    font-weight: 800;
    color: ${({ theme }) => theme.text_primary};
`;

const Button = styled.button`
    background: ${({ theme, $isApplied }) => $isApplied ? '#d32f2f' : theme.primary};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: ${({ $isApplied, disabled }) => ($isApplied || disabled) ? 'not-allowed' : 'pointer'};
    transition: background 0.2s ease;
    width: 100%;
    margin-top: 10px;
    opacity: ${({ $isApplied, disabled }) => ($isApplied || disabled) ? 0.7 : 1};

    &:hover {
        background: ${({ theme, $isApplied, disabled }) => ($isApplied || disabled) ? null : theme.primary_hover};
    }
`;

const AnalyzeButton = styled.button`
    padding: 10px 20px;
    background-color: ${({ $analyzing, theme }) => $analyzing ? '#90caf9' : theme.primary};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: ${({ $analyzing }) => $analyzing ? 'not-allowed' : 'pointer'};
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    
    @media (max-width: 768px) {
        width: 100%;
        padding: 12px;
    }
`;

const AnalysisSection = styled.div`
    padding: 24px;
    border-radius: 12px;
    background: ${({ theme }) => theme.bgLight || '#fafafa'};
    border-left: 5px solid ${({ $color }) => $color};
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const AnalysisHeader = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
`;

const StatGrid = styled.div`
    display: flex;
    gap: 32px;
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: ${({ theme }) => theme.text_primary};
`;

const Strong = styled.strong`
    color: ${({ theme }) => theme.text_primary};
`;

const FactorsList = styled.ul`
    margin: 0;
    padding-left: 20px;
    color: ${({ theme }) => theme.text_secondary};
    font-size: 15px;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const PolicyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);

    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const data = await getPolicyById(id);
                setPolicy(data);
                if (data?.analysis?.risk) {
                    setAnalysis(data.analysis);
                }
            } catch (err) {
                setError('Failed to fetch policy.');
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, [id]);

    const handleAnalyze = async () => {
        try {
            setAnalyzing(true);
            const result = await analyzePolicyApi(id);
            setAnalysis(result);
            setPolicy((prev) => ({ ...prev, analysis: result }));
        } catch (err) {
            alert('Failed to analyze policy.');
        } finally {
            setAnalyzing(false);
        }
    };

    const isApplied = policy && currentUser?.applications?.some(app => {
        const appId = (app.policyId && typeof app.policyId === 'object') ? app.policyId._id : app.policyId;
        return appId === policy._id;
    });

    const handleApply = async () => {
        if (!policy || isApplied) return;
        setIsApplying(true);
        try {
            const response = await applyForPolicy({
                userId: currentUser._id,
                policyId: policy._id
            });
            if (response) {
                dispatch(addApplication(response));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to apply for policy");
            if (currentUser && currentUser._id) {
                const apps = await getUserApplications(currentUser._id);
                dispatch(setApplications(apps));
            }
        } finally {
            setIsApplying(false);
        }
    };

    const getRiskColor = (risk) => {
        if (!risk) return '#333';
        const str = risk.toLowerCase();
        if (str.includes('high')) return '#d32f2f';
        if (str.includes('medium')) return '#ed6c02';
        if (str.includes('low')) return '#2e7d32';
        return '#333';
    };

    const getHighlightedDescription = () => {
        if (!analysis || !analysis.reasons || analysis.reasons.length === 0) {
            return <span>{policy.description}</span>;
        }

        let words = policy.description.split(' ');
        const stopWords = ['these','those','their','where','which','would','should','could','about','after','other','there','under'];

        const isRisky = (word) => {
            if (word.length <= 4) return false;
            const stripped = word.replace(/[^\w]/g, '').toLowerCase();
            if (stopWords.includes(stripped)) return false;
            return analysis.reasons.some(r => r.toLowerCase().includes(stripped));
        };

        return (
            <span>
                {words.map((word, i) => {
                    const highlight = isRisky(word);
                    return highlight ? (
                        <span 
                            key={i} 
                            style={{ 
                                backgroundColor: '#ffc107', 
                                color: '#000',
                                fontWeight: 'bold', 
                                padding: '1px 2px', 
                                borderRadius: '3px', 
                                marginRight: '4px'
                            }}
                        >
                            {word}
                        </span>
                    ) : (
                        <span key={i} style={{ marginRight: '4px' }}>{word}</span>
                    );
                })}
            </span>
        );
    };

    if (loading) return <Loader />;
    if (error) return <Container><h2 style={{ color: '#d32f2f' }}>{error}</h2></Container>;
    if (!policy) return <Container><h2>Policy not found.</h2></Container>;

    return (
        <Container>
            <BackNav onClick={() => navigate(-1)}>
                <ArrowBack fontSize="small" /> Go Back
            </BackNav>
            
            <Header>
                <TitleWrapper>
                    <Title>{policy.title}</Title>
                    <Tag>{policy.category}</Tag>
                </TitleWrapper>
                <AnalyzeButton onClick={handleAnalyze} disabled={analyzing} $analyzing={analyzing}>
                    {analyzing ? 'Analyzing Risk...' : 'Analyze Policy Risk (AI)'}
                </AnalyzeButton>
            </Header>

            <PolicyCard>
                <FullPolicyDescription>
                    {getHighlightedDescription()}
                </FullPolicyDescription>

                {analysis && (
                    <AnalysisSection $color={getRiskColor(analysis.risk)}>
                        <AnalysisHeader>AI Analysis Results</AnalysisHeader>
                        <StatGrid>
                            <StatItem>
                                <Strong>Risk Level:</Strong> 
                                <span style={{ color: getRiskColor(analysis.risk), fontWeight: 'bold' }}>
                                    {analysis.risk}
                                </span>
                            </StatItem>
                            <StatItem>
                                <Strong>Complexity:</Strong> 
                                <span style={{ color: analysis.complexity?.toLowerCase() === 'hard' ? '#d32f2f' : 'inherit', fontWeight: 'bold' }}>
                                    {analysis.complexity}
                                </span>
                            </StatItem>
                        </StatGrid>
                        <div>
                            <Strong style={{ display: 'block', marginBottom: '8px' }}>Risk Factors:</Strong>
                            <FactorsList>
                                {analysis.reasons?.map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                ))}
                            </FactorsList>
                        </div>
                    </AnalysisSection>
                )}

                <div>
                    <DetailsRow>
                        <DetailItem><GppGood fontSize="small" /> Coverage Amount</DetailItem>
                        <Price>{String(policy.coverage).startsWith('₹') ? policy.coverage : `₹${policy.coverage}`}</Price>
                    </DetailsRow>
                    <DetailsRow style={{ borderTop: 'none', paddingTop: 0 }}>
                        <DetailItem><CurrencyRupee fontSize="small" /> Monthly Premium</DetailItem>
                        <Price>{String(policy.premium).startsWith('₹') ? policy.premium : `₹${policy.premium}`}</Price>
                    </DetailsRow>
                </div>

                <Button 
                    onClick={handleApply} 
                    disabled={isApplied || isApplying} 
                    $isApplied={isApplied}
                >
                    {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply Now'}
                </Button>
            </PolicyCard>
        </Container>
    );
};

export default PolicyDetails;
