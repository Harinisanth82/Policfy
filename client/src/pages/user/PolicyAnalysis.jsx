import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { analyzePolicyApi, getPolicyById } from '../../api';
import { 
    ArrowBack, LightbulbCircle, HealthAndSafety, 
    WarningAmber, MonetizationOn, CompareArrows, 
    CheckCircle, Info, Speed 
} from '@mui/icons-material';

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

const Strong = styled.strong`
    color: ${({ theme }) => theme.text_primary};
    font-weight: 700;
`;

const FullPolicyDescription = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
    line-height: 1.7;
    margin: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
`;

const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const SectionCard = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid ${({ theme }) => theme.text_secondary}20;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: ${({ theme }) => theme.primary};
    }
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${({ theme }) => theme.text_primary};
    
    h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
    }
    
    svg {
        font-size: 24px;
        color: ${({ theme }) => theme.primary};
    }
`;

const DataRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.text_secondary}15;
    
    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

const DataLabel = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const DataValue = styled.span`
    font-size: 14px;
    color: ${({ theme }) => theme.text_primary};
    line-height: 1.5;
    font-weight: 500;
`;

const ProgressContainer = styled.div`
    width: 100%;
    height: 8px;
    background: ${({ theme }) => theme.bgLight || '#e0e0e0'};
    border-radius: 8px;
    overflow: hidden;
    margin-top: 4px;
`;

const ProgressBarFill = styled.div`
    height: 100%;
    width: ${({ $value }) => $value}%;
    background: ${({ $color, theme }) => $color || theme.primary};
    border-radius: 8px;
    transition: width 1s ease-in-out;
`;

const TagList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
`;

const Tag = styled.div`
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    background: ${({ $color }) => $color}15;
    color: ${({ $color }) => $color};
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid ${({ $color }) => $color}40;
`;

const LoadingOverlay = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 20px;
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border-radius: 16px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.03);
    padding: 60px;
    margin: auto 0;
    
    h2 {
        color: ${({ theme }) => theme.primary};
        font-weight: 700;
        animation: pulse 1.5s infinite;
        margin: 0;
        font-size: 20px;
    }
    
    p {
        color: ${({ theme }) => theme.text_secondary};
        font-size: 14px;
        margin: 0;
    }

    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
`;

const getColorForScore = (score) => {
    if (score >= 80) return '#2e7d32'; 
    if (score >= 50) return '#ed6c02'; 
    return '#d32f2f'; 
};

const getColorForLevel = (level) => {
    if (!level) return '#333';
    const l = level.toLowerCase();
    if (l.includes('low') || l.includes('easy') || l.includes('excellent') || l.includes('good')) return '#2e7d32';
    if (l.includes('medium') || l.includes('fair')) return '#ed6c02';
    if (l.includes('high') || l.includes('hard') || l.includes('poor')) return '#d32f2f';
    return '#1976d2';
};

const PolicyAnalysis = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndAnalyze = async () => {
            setLoading(true);
            try {
                const fetchedPolicy = await getPolicyById(id);
                setPolicy(fetchedPolicy);

                if (fetchedPolicy?.analysis?.coreInsights) {
                    setAnalysis(fetchedPolicy.analysis);
                } else {
                    setAnalyzing(true);
                    const result = await analyzePolicyApi(id);
                    setAnalysis(result);
                    setPolicy(prev => ({ ...prev, analysis: result }));
                    setAnalyzing(false);
                }
            } catch (err) {
                console.error("Error fetching/analyzing policy:", err);
                setError("Failed to load policy analysis.");
                setAnalyzing(false);
            } finally {
                setLoading(false);
            }
        };

        fetchAndAnalyze();
    }, [id]);

    const getHighlightedDescription = () => {
        if (!policy || !analysis || !analysis.reasons) return <span>{policy?.description}</span>;
        
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
                        <span key={i} style={{ backgroundColor: '#ffc107', color: '#000', fontWeight: 'bold', padding: '1px 2px', borderRadius: '3px', marginRight: '4px' }}>
                            {word}
                        </span>
                    ) : (
                        <span key={i} style={{ marginRight: '4px' }}>{word}</span>
                    );
                })}
            </span>
        );
    };

    if (loading || analyzing) {
        return (
            <Container>
                <BackNav onClick={() => navigate('/user/policies')}>
                    <ArrowBack fontSize="small" /> Back to Policies
                </BackNav>
                <LoadingOverlay>
                    <Speed sx={{ fontSize: 50, color: '#1976d2', animation: 'spin 2s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />
                    <h2>{analyzing ? "AI is decoding policy nuances..." : "Loading Policy Data..."}</h2>
                    <p>{analyzing ? "This may take a few seconds as we run comprehensive checks." : ""}</p>
                </LoadingOverlay>
            </Container>
        );
    }

    if (error || !analysis) {
        return (
            <Container>
                <BackNav onClick={() => navigate('/user/policies')}>
                    <ArrowBack fontSize="small" /> Back to Policies
                </BackNav>
                <h2 style={{ color: '#d32f2f', fontSize: '18px' }}>{error || "Analysis not available"}</h2>
            </Container>
        );
    }

    const { coreInsights, smartAnalysis, alertsGaps, valueAnalysis, comparisonSupport } = analysis;

    return (
        <Container>
            <BackNav onClick={() => navigate('/user/policies')}>
                <ArrowBack fontSize="small" /> Back to Policies
            </BackNav>
            
            <Header>
                <Title>{policy?.title} - AI Risk Analysis</Title>
                <Subtitle>Comprehensive AI-driven insights, evaluating risk, coverage, and value.</Subtitle>
            </Header>

            <DashboardGrid>
                {/* Core Policy Insights */}
                <SectionCard>
                    <SectionHeader>
                        <LightbulbCircle /> <h2>Core Policy Insights</h2>
                    </SectionHeader>
                    {coreInsights ? (
                        <>
                            <DataRow><DataLabel>Summary</DataLabel><DataValue>{coreInsights.summary}</DataValue></DataRow>
                            <DataRow><DataLabel>Coverage Overview</DataLabel><DataValue>{coreInsights.coverageOverview}</DataValue></DataRow>
                            <DataRow><DataLabel>Premium Details</DataLabel><DataValue>{coreInsights.premiumDetails}</DataValue></DataRow>
                            <DataRow><DataLabel>Duration Info</DataLabel><DataValue>{coreInsights.durationInfo}</DataValue></DataRow>
                            <DataRow><DataLabel>Eligibility Criteria</DataLabel><DataValue>{coreInsights.eligibility}</DataValue></DataRow>
                        </>
                    ) : <DataRow><DataValue>Generating insights...</DataValue></DataRow>}
                </SectionCard>

                {/* Smart Analysis */}
                <SectionCard>
                    <SectionHeader>
                        <HealthAndSafety /> <h2>Smart Analysis</h2>
                    </SectionHeader>
                    {smartAnalysis ? (
                        <>
                            <DataRow>
                                <DataLabel>Coverage Score ({smartAnalysis.coverageScore}/100)</DataLabel>
                                <ProgressContainer>
                                    <ProgressBarFill $value={smartAnalysis.coverageScore} $color={getColorForScore(smartAnalysis.coverageScore)} />
                                </ProgressContainer>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Policy Strength Score ({smartAnalysis.strengthScore}/100)</DataLabel>
                                <ProgressContainer>
                                    <ProgressBarFill $value={smartAnalysis.strengthScore} $color={getColorForScore(smartAnalysis.strengthScore)} />
                                </ProgressContainer>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Key Indicators</DataLabel>
                                <TagList>
                                    <Tag $color={getColorForLevel(smartAnalysis.riskLevel)}>Risk: {smartAnalysis.riskLevel}</Tag>
                                    <Tag $color={getColorForLevel(smartAnalysis.complexityLevel)}>Complexity: {smartAnalysis.complexityLevel}</Tag>
                                    <Tag $color={getColorForLevel(smartAnalysis.claimProbability)}>Claim Prob: {smartAnalysis.claimProbability}</Tag>
                                </TagList>
                            </DataRow>
                        </>
                    ) : <DataRow><DataValue>Analyzing...</DataValue></DataRow>}
                </SectionCard>

                {/* Alerts & Gaps */}
                <SectionCard>
                    <SectionHeader>
                        <WarningAmber /> <h2>Alerts & Gaps</h2>
                    </SectionHeader>
                    {alertsGaps ? (
                        <>
                            <DataRow>
                                <DataLabel>Claim Rejection Risk</DataLabel>
                                <DataValue style={{ color: getColorForLevel(alertsGaps.claimRejectionRisk), fontWeight: '700', fontSize: '15px' }}>
                                    {alertsGaps.claimRejectionRisk}
                                </DataValue>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Missing Coverage</DataLabel>
                                <ul style={{ margin: '6px 0 0 20px', padding: 0, color: '#d32f2f', fontSize: '14px' }}>
                                    {alertsGaps.missingCoverage?.length > 0 ? alertsGaps.missingCoverage.map((m, i) => <li key={i}>{m}</li>) : <li>None detected</li>}
                                </ul>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Hidden Clauses / High Risk</DataLabel>
                                <ul style={{ margin: '6px 0 0 20px', padding: 0, color: '#ed6c02', fontSize: '14px' }}>
                                    {[...(alertsGaps.hiddenClauses || []), ...(alertsGaps.highRiskConditions || [])].length > 0 
                                      ? [...(alertsGaps.hiddenClauses || []), ...(alertsGaps.highRiskConditions || [])].map((ex, i) => <li key={i}>{ex}</li>)
                                      : <li>None detected</li>}
                                </ul>
                            </DataRow>
                        </>
                    ) : <DataRow><DataValue>Scanning for gaps...</DataValue></DataRow>}
                </SectionCard>

                {/* Value Analysis */}
                <SectionCard>
                    <SectionHeader>
                        <MonetizationOn /> <h2>Value Analysis</h2>
                    </SectionHeader>
                    {valueAnalysis ? (
                        <>
                            <DataRow>
                                <DataLabel>Cost Efficiency Score ({valueAnalysis.costEfficiencyScore}/100)</DataLabel>
                                <ProgressContainer>
                                    <ProgressBarFill $value={valueAnalysis.costEfficiencyScore} $color={getColorForScore(valueAnalysis.costEfficiencyScore)} />
                                </ProgressContainer>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Value for Money Indicator</DataLabel>
                                <DataValue style={{ color: getColorForLevel(valueAnalysis.valueForMoney), fontWeight: '600' }}>
                                    {valueAnalysis.valueForMoney}
                                </DataValue>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Premium vs Coverage</DataLabel>
                                <DataValue>{valueAnalysis.premiumVsCoverage}</DataValue>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Benefit Breakdown</DataLabel>
                                <TagList>
                                    {valueAnalysis.benefitBreakdown?.map((b, i) => <Tag key={i} $color="#2e7d32"><CheckCircle fontSize="small"/> {b}</Tag>)}
                                </TagList>
                            </DataRow>
                        </>
                    ) : <DataRow><DataValue>Calculating value...</DataValue></DataRow>}
                </SectionCard>

                {/* Comparison Support */}
                <SectionCard>
                    <SectionHeader>
                        <CompareArrows /> <h2>Comparison Support</h2>
                    </SectionHeader>
                    {comparisonSupport ? (
                        <>
                            <DataRow>
                                <DataLabel>Similarity Indicator</DataLabel>
                                <DataValue style={{ fontSize: '18px', fontWeight: '700', color: '#ed6c02' }}>
                                    {comparisonSupport.similarityIndicator}% Match
                                </DataValue>
                                <ProgressContainer>
                                    <ProgressBarFill $value={comparisonSupport.similarityIndicator} $color="#ed6c02" />
                                </ProgressContainer>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Similar Policies Category</DataLabel>
                                <ul style={{ margin: '6px 0 0 20px', padding: 0, color: '#333', fontSize: '14px' }}>
                                    {comparisonSupport.similarPolicies?.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </DataRow>
                            <DataRow>
                                <DataLabel>Better Alternatives Suggested</DataLabel>
                                <TagList>
                                    {comparisonSupport.betterAlternatives?.length > 0
                                        ? comparisonSupport.betterAlternatives.map((a, i) => <Tag key={i} $color="#1976d2"><Info fontSize="small"/> {a}</Tag>)
                                        : <Tag $color="#333">No immediate alternatives</Tag>}
                                </TagList>
                            </DataRow>
                        </>
                    ) : <DataRow><DataValue>Comparing...</DataValue></DataRow>}
                </SectionCard>

            </DashboardGrid>

            {analysis && (
                <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <Strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>Highlighted Policy Description</Strong>
                    <Subtitle style={{ fontSize: '13px', marginBottom: '12px' }}>Words highlighted in yellow correlate with identified risk factors.</Subtitle>
                    <FullPolicyDescription>
                        {getHighlightedDescription()}
                    </FullPolicyDescription>
                </div>
            )}
        </Container>
    );
};

export default PolicyAnalysis;
