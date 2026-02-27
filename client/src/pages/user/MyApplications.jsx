import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    AccessTime,
    CheckCircle,
    Cancel,
    CalendarMonth,
    HelpOutline,
    DeleteRounded
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
// import { deleteApplication as deleteAppAction } from '../../redux/userSlice';
import { getUserApplications, deleteApplication } from '../../api';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';

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

const FilterSection = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
`;

const FilterButton = styled.button`
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid ${({ theme, $active }) => $active ? theme.primary : theme.text_secondary + '30'};
    background: ${({ theme, $active }) => $active ? theme.primary : 'transparent'};
    color: ${({ theme, $active }) => $active ? '#ffffff' : theme.text_secondary};
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.primary};
        color: ${({ theme, $active }) => $active ? '#ffffff' : theme.primary};
    }
`;

const ApplicationList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ApplicationCard = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border: 2px solid ${({ theme }) => theme.text_secondary}40; /* Thicker and darker border */
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* Stronger hover shadow */
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: nowrap;
`;

const PolicyInfo = styled.div`
    display: flex;
    gap: 12px;
    align-items: flex-start;
    flex: 1;
`;

const PolicyIcon = styled.div`
    color: ${({ theme }) => theme.text_primary};
    display: flex;
    margin-top: 2px;
`;

const InfoContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const PolicyName = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const PolicyDescription = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CategoryBadge = styled.span`
    font-size: 13px;
    opacity: 0.9;
    background: ${({ theme }) => theme.text_secondary}20;
    color: ${({ theme }) => theme.text_primary};
    padding: 2px 8px;
    border-radius: 4px;
    width: fit-content;
`;

const StatusBadge = styled.div`
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    background: ${({ $status, theme }) =>
        $status === 'Approved' ? theme.green + '15' :
            $status === 'Rejected' ? theme.red + '15' :
                theme.orange + '15'};
    color: ${({ $status, theme }) =>
        $status === 'Approved' ? theme.green :
            $status === 'Rejected' ? theme.red :
                theme.orange};
    border: 1px solid ${({ $status, theme }) =>
        $status === 'Approved' ? theme.green + '30' :
            $status === 'Rejected' ? theme.red + '30' :
                theme.orange + '30'};
`;

const MetaRow = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.text_secondary};
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const StatusGuide = styled.div`
    background: ${({ theme }) => theme.primary + '20'};
    border: 1px solid ${({ theme }) => theme.primary + '40'};
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;
`;

const GuideTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const GuideItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
`;

const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: ${({ theme }) => theme.red};
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;

    &:hover {
        background: ${({ theme }) => theme.red + 'dd'};
        transform: translateY(-1px);
        box-shadow: 0 2px 8px ${({ theme }) => theme.red + '40'};
    }
`;

const MyApplications = () => {
    const [filter, setFilter] = useState('All');
    const { currentUser } = useSelector(state => state.user);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            try {
                const data = await getUserApplications(currentUser._id);
                // Map backend data to frontend structure
                const mappedApps = data.map(app => ({
                    id: app._id,
                    policyId: app.policyId?._id,
                    policyName: app.policyId?.title || 'Unknown Policy',
                    description: app.policyId?.description || 'The policy is no longer available',
                    category: app.policyId?.category || 'General',
                    premium: `₹${app.policyId?.premium || 0}`,
                    appliedDate: new Date(app.createdAt).toLocaleDateString(),
                    status: app.status.charAt(0).toUpperCase() + app.status.slice(1)
                }));
                setApplications(mappedApps);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser._id) {
            fetchApplications();
        } else {
            setLoading(false);
        }
    }, [currentUser?._id]);

    const filteredApps = (filter === 'All'
        ? applications
        : applications.filter(app => app.status === filter)
    ).sort((a, b) => {
        const statusA = (a.status || '').toLowerCase();
        const statusB = (b.status || '').toLowerCase();

        if (statusA === 'pending' && statusB !== 'pending') return -1;
        if (statusA !== 'pending' && statusB === 'pending') return 1;
        return 0;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle sx={{ fontSize: 18 }} />;
            case 'Rejected': return <Cancel sx={{ fontSize: 18 }} />;
            default: return <AccessTime sx={{ fontSize: 18 }} />;
        }
    };

    const [deletingId, setDeletingId] = useState(null);

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel Application?',
            text: "Are you sure you want to cancel this application?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef5350',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            setDeletingId(id);
            try {

                await deleteApplication(id);
                setApplications(prev => prev.filter(app => app.id !== id));
                await Swal.fire(
                    'Cancelled!',
                    'Your application has been cancelled.',
                    'success'
                );
            } catch (error) {
                console.error("Error canceling application:", error);
                await Swal.fire(
                    'Error!',
                    error.response?.data?.message || 'Failed to cancel application.',
                    'error'
                );
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Container>
            <Header>
                <Title>My Applications</Title>
                <Subtitle>Track the status of your policy applications.</Subtitle>
            </Header>

            <FilterSection>
                {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                    <FilterButton
                        key={status}
                        $active={filter === status}
                        onClick={() => setFilter(status)}
                    >
                        {status}
                    </FilterButton>
                ))}
            </FilterSection>

            <ApplicationList>
                {filteredApps.map(app => (
                    <ApplicationCard key={app.id}>
                        <CardHeader>
                            <PolicyInfo>
                                <PolicyIcon>
                                    {getStatusIcon(app.status)}
                                </PolicyIcon>
                                <InfoContent>
                                    <PolicyName>{app.policyName}</PolicyName>
                                    <CategoryBadge>
                                        {app.category}
                                    </CategoryBadge>
                                    <PolicyDescription>{app.description}</PolicyDescription>
                                </InfoContent>
                            </PolicyInfo>
                            <StatusBadge $status={app.status}>
                                {app.status}
                            </StatusBadge>
                        </CardHeader>

                        <MetaRow>
                            <MetaItem>
                                <CalendarMonth sx={{ fontSize: 16 }} />
                                Applied: <span style={{ fontWeight: 500, color: 'inherit' }}>{app.appliedDate}</span>
                            </MetaItem>

                            <MetaItem>
                                Premium: <span style={{ fontWeight: 500, color: 'inherit' }}>{app.premium}</span>
                            </MetaItem>


                            {app.status === 'Pending' && (
                                <DeleteButton
                                    onClick={() => handleCancel(app.id)}
                                    disabled={deletingId === app.id}
                                    style={{
                                        opacity: deletingId === app.id ? 0.7 : 1,
                                        cursor: deletingId === app.id ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {deletingId === app.id ? (
                                        <>Deleting...</>
                                    ) : (
                                        <><DeleteRounded sx={{ fontSize: 18 }} /> Cancel</>
                                    )}
                                </DeleteButton>
                            )}
                        </MetaRow>
                    </ApplicationCard>
                ))}

                {filteredApps.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'inherit', opacity: 0.6 }}>
                        No applications found.
                    </div>
                )}
            </ApplicationList>

            <StatusGuide>
                <GuideTitle>
                    <HelpOutline sx={{ fontSize: 20 }} /> Application Status Guide
                </GuideTitle>
                <GuideItem>
                    <AccessTime sx={{ fontSize: 18 }} />
                    <strong>Pending:</strong> Your application is under review
                </GuideItem>
                <GuideItem>
                    <CheckCircle sx={{ fontSize: 18 }} />
                    <strong>Approved:</strong> Congratulations! Your application has been accepted
                </GuideItem>
                <GuideItem>
                    <Cancel sx={{ fontSize: 18 }} />
                    <strong>Rejected:</strong> Your application was not approved at this time
                </GuideItem>
            </StatusGuide>

        </Container>
    );
};

export default MyApplications;
