
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DescriptionRounded, AssignmentRounded, CheckCircleRounded, AccessTimeRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserStats } from '../../api';
import Loader from '../../components/Loader';

const Container = styled.div`
    padding: 22px 30px 30px 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 30px;
    
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

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
`;

const StatCard = styled.div`
    background: ${({ theme }) => theme.card || '#ffffff'};
    border: 2px solid ${({ $borderColor, theme }) => $borderColor || theme.text_secondary + '40'}; /* Thicker and darker border */
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* Stronger hover shadow */
    }
`;

const StatInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px; // Reduced from 12px to match Admin spacing
`;

const StatTitle = styled.div`
    font-size: 16px; 
    color: ${({ $color, theme }) => $color || theme.text_secondary}; 
    font-weight: 600;
`;

const StatValue = styled.div`
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
`;

const IconBox = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $color }) => $color ? $color + '20' : 'transparent'}; // Slightly darker bg for icon
    color: ${({ $color, theme }) => $color || theme.text_primary};
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
`;

const ActionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ActionCard = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border: 2px solid ${({ theme }) => theme.text_secondary}40; /* Thicker and darker border */
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    cursor: pointer;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.primary};
        transform: translateY(-2px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* Stronger hover shadow */
    }
`;

const ActionHeader = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
`;

const ActionDesc = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
    line-height: 1.5;
    flex: 1;
`;

const UserDashboard = () => {
    const navigate = useNavigate();

    const { currentUser } = useSelector(state => state.user);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getUserStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser._id) {
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return <Loader />
    }

    const getIcon = (iconType) => {
        switch (iconType) {
            case 'DescriptionRounded': return <DescriptionRounded />;
            case 'AssignmentRounded': return <AssignmentRounded />;
            case 'CheckCircleRounded': return <CheckCircleRounded />;
            case 'AccessTimeRounded': return <AccessTimeRounded />;
            default: return <DescriptionRounded />;
        }
    };

    return (
        <Container>
            <Header>
                <Title>Dashboard Overview</Title>
                <Subtitle>Welcome back! Here's your policy summary.</Subtitle>
            </Header>

            <StatsGrid>
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        $borderColor={stat.borderColor}
                    >
                        <StatInfo>
                            <StatTitle $color={stat.borderColor}>{stat.title}</StatTitle>
                            <StatValue>{stat.value}</StatValue>
                        </StatInfo>
                        <IconBox $color={stat.color}>
                            {getIcon(stat.iconType)}
                        </IconBox>
                    </StatCard>
                ))}
            </StatsGrid>

            <Section>
                <SectionTitle>Quick Actions</SectionTitle>
                <ActionGrid>
                    <ActionCard onClick={() => navigate('/user/policies')}>
                        <ActionHeader>Browse Policies</ActionHeader>
                        <ActionDesc>
                            Explore available insurance policies and find the perfect coverage for your needs.
                        </ActionDesc>
                    </ActionCard>

                    <ActionCard onClick={() => navigate('/user/my-applications')}>
                        <ActionHeader>Track Applications</ActionHeader>
                        <ActionDesc>
                            Monitor the status of your submitted applications and view approval updates.
                        </ActionDesc>
                    </ActionCard>
                </ActionGrid>
            </Section>
        </Container>
    );
};

export default UserDashboard;
