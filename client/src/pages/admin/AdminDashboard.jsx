import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    GroupRounded,
    DescriptionRounded,
    CheckCircleRounded,
    AccessTimeRounded,
    TrendingUpRounded,
    NotificationsRounded
} from '@mui/icons-material';
import ActivityTrendChart from '../../components/ActivityTrendChart';
import { getAdminStats } from '../../api';
import Loader from '../../components/Loader';

// --- Styled Components ---

const Container = styled.div`
    padding: 22px 30px 30px 30px; // Reduced top padding
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'}; /* Clean light background */
    display: flex;
    flex-direction: column;
    gap: 30px;
    @media (max-width: 768px) {
        padding: 20px;
        gap: 20px;
    }
`;

// Simple Header
const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const Title = styled.h1`
    font-size: 26px;
    font-weight: 600; // Reduced from 700
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const StatValue = styled.div`
    font-size: 32px; // Large size from image
    font-weight: 600; // Reduced from 700
    color: ${({ theme }) => theme.text_primary}; // Dark / Black
    line-height: 1.2;
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    @media (max-width: 1100px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const Card = styled.div`
    background: ${({ theme }) => theme.card};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
    border: 2px solid ${({ theme }) => theme.text_secondary}40; /* Thicker and darker border */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* Stronger hover shadow */
    }
`;

const StatCard = styled(Card)`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const IconWrapper = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $color }) => $color}15;
    color: ${({ $color }) => $color};
    font-size: 28px;
    flex-shrink: 0;
`;

const StatInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StatLabel = styled.div`
    font-size: 16px; // Title size
    font-weight: 500; // Reduced from 600
    color: ${({ theme }) => theme.primary}; // Blue color from image
    margin-bottom: 4px;
`;

const CardTitle = styled.h3`
    font-size: 18px;
    font-weight: 500; // Reduced from 600
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const MainSection = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    @media (max-width: 1000px) {
        grid-template-columns: 1fr;
    }
`;

const SectionCard = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 350px;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

// Updates List Styles
const UpdatesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const UpdateItem = styled.div`
    display: flex;
    gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid ${({ theme }) => theme.text_secondary}15;
    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
    &:first-child {
        padding-top: 0;
    }
`;

const UpdateIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: ${({ $color }) => $color}15;
    color: ${({ $color }) => $color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
`;

const UpdateContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
`;

const UpdateText = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
`;

const UpdateTime = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
`;


const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const data = await getAdminStats();

            setStats(data.stats);
            setRecentActivity(data.recentActivity);
            setActivityData(data.activityData || []);

        } catch (error) {
            console.error("Error fetching admin dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    const getIcon = (iconType) => {
        switch (iconType) {
            case 'GroupRounded': return <GroupRounded />;
            case 'DescriptionRounded': return <DescriptionRounded />;
            case 'CheckCircleRounded': return <CheckCircleRounded />;
            case 'AccessTimeRounded': return <AccessTimeRounded />;
            case 'NotificationsRounded': return <NotificationsRounded fontSize="small" />;
            default: return <DescriptionRounded />;
        }
    };

    return (
        <Container>
            <Header>
                <Title>Dashboard</Title>
                <Subtitle>Welcome back, Admin. Here's what's happening today.</Subtitle>
            </Header>

            {/* Top Stats Row */}
            <StatsGrid>
                {stats.map((stat, index) => (
                    <StatCard key={index}>
                        <IconWrapper $color={stat.color}>
                            {getIcon(stat.iconType)}
                        </IconWrapper>
                        <StatInfo>
                            <StatLabel>{stat.label}</StatLabel>
                            <StatValue>{stat.value}</StatValue>
                        </StatInfo>
                    </StatCard>
                ))}
            </StatsGrid>

            <MainSection>
                {/* Left: Chart */}
                <SectionCard>
                    <CardHeader>
                        <CardTitle>
                            <TrendingUpRounded sx={{ color: '#5B86E5' }} />
                            Activity Overview
                        </CardTitle>
                    </CardHeader>
                    <ActivityTrendChart data={activityData} />
                </SectionCard>

                {/* ... (existing Recent Activity) */}
                <SectionCard>
                    <CardHeader>
                        <CardTitle>
                            <NotificationsRounded sx={{ color: '#ef5350' }} />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <UpdatesList>
                        {recentActivity.length > 0 ? (
                            recentActivity.map((item, index) => (
                                <UpdateItem key={index}>
                                    <UpdateIcon $color={item.color}>
                                        {getIcon(item.iconType)}
                                    </UpdateIcon>
                                    <UpdateContent>
                                        <UpdateText>{item.title}</UpdateText>
                                        <UpdateTime>{item.time}</UpdateTime>
                                    </UpdateContent>
                                </UpdateItem>
                            ))
                        ) : (
                            <div style={{ padding: '20px', color: 'inherit', opacity: 0.6, textAlign: 'center' }}>No recent activity to show</div>
                        )}
                    </UpdatesList>
                </SectionCard>
            </MainSection>
        </Container>
    );
};

export default AdminDashboard;
