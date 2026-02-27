import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Undo,
    Search
} from '@mui/icons-material';
import { getAllApplications, updateApplicationStatus } from '../../api';
import Loader from '../../components/Loader';
import TablePagination from '../../components/TablePagination';
import Swal from 'sweetalert2';



const Container = styled.div`
    padding: 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    @media (max-width: 768px) {
        padding: 20px;
        gap: 16px;
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Title = styled.h1`
    font-size: 26px;
    font-weight: 600; // Reduced from 700
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div`
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StatLabel = styled.div`
    font-size: 16px;
    font-weight: 500; // Reduced from 600
    color: ${({ theme }) => theme.primary}; // Blue color
`;

const StatValue = styled.div`
    font-size: 32px;
    font-weight: 600; // Reduced from 700
    color: ${({ theme }) => theme.text_primary}; // Dark color
`;

const ContentCard = styled.div`
    background: ${({ theme }) => theme.card};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
    border: 2px solid ${({ theme }) => theme.text_secondary}40; /* Thicker and darker border */
    display: flex;
    flex-direction: column;
    gap: 20px;
    transition: box-shadow 0.2s ease;

    &:hover {
         box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* Stronger hover shadow */
    }
`;


const SearchBar = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: ${({ theme }) => theme.bgLight || '#f8f9fa'};
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.text_secondary + '60'};
    max-width: 400px;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 10px 14px;
    }
    
    &:focus-within {
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}15;
    }
`;

const SearchInput = styled.input`
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: ${({ theme }) => theme.text_primary};
    width: 100%;
    &::placeholder {
        color: ${({ theme }) => theme.text_secondary};
    }
`;


const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    padding-bottom: 12px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
`;

const Thead = styled.thead`
    border-bottom: 2px solid ${({ theme }) => theme.text_secondary}10;
`;

const Th = styled.th`
    text-align: ${({ $align }) => $align || 'left'};
    padding: 16px 12px;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: ${({ $width }) => $width || 'auto'};
`;

const Tr = styled.tr`
    border-bottom: 1px solid ${({ theme }) => theme.text_secondary}10;
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background: ${({ theme }) => theme.bgLight}50;
    }
`;

const Td = styled.td`
    padding: 16px 12px;
    font-size: 14px;
    color: ${({ theme }) => theme.text_primary};
    vertical-align: middle;
    text-align: ${({ $align }) => $align || 'left'};
`;

const ApplicantName = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
`;


const StatusBadge = styled.div`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
    display: inline-block;
    background: ${({ $status, theme }) =>
        $status === 'Approved' ? theme.green + '15' :
            $status === 'Rejected' ? theme.red + '15' :
                theme.yellow + '15'};
    color: ${({ $status, theme }) =>
        $status === 'Approved' ? theme.green :
            $status === 'Rejected' ? theme.red :
                theme.yellow};
`;


const ActionsCell = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-end;
`;

const ActionButton = styled.button`
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    background: ${({ $type, theme }) =>
        $type === 'approve' ? theme.green + '15' :
            $type === 'reject' ? theme.red + '15' :
                theme.primary + '15'};
    color: ${({ $type, theme }) =>
        $type === 'approve' ? theme.green :
            $type === 'reject' ? theme.red :
                theme.primary};

    &:hover {
        transform: translateY(-1px);
        background: ${({ $type, theme }) =>
        $type === 'approve' ? theme.green + '25' :
            $type === 'reject' ? theme.red + '25' :
                theme.primary + '25'};
    }

    /* Disable style if needed */
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`;




const Applications = () => {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await getAllApplications();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };


    const pendingCount = applications.filter(a => a.status?.toLowerCase() === 'pending').length;
    const approvedCount = applications.filter(a => a.status?.toLowerCase() === 'approved').length;
    const rejectedCount = applications.filter(a => a.status?.toLowerCase() === 'rejected').length;

    if (loading) {
        return <Loader />;
    }


    const filteredApplications = applications
        .filter(app => {
            const applicantName = app.userId?.name || 'Unknown User';
            const policyName = app.policyId?.title || 'Unknown Policy';
            const searchLower = searchTerm.toLowerCase();
            return applicantName.toLowerCase().includes(searchLower) || policyName.toLowerCase().includes(searchLower);
        })
        .sort((a, b) => {
            const statusA = (a.status || '').toLowerCase();
            const statusB = (b.status || '').toLowerCase();

            if (statusA === 'pending' && statusB !== 'pending') return -1;
            if (statusA !== 'pending' && statusB === 'pending') return 1;
            return 0;
        });

    const totalEntries = filteredApplications.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const currentApplications = filteredApplications.slice(startIndex, endIndex);


    const handleAction = async (id, newStatus) => {

        const previousApplications = [...applications];
        setApplications(prev => prev.map(app =>
            app._id === id ? { ...app, status: newStatus } : app
        ));

        if (newStatus === 'Rejected') {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to reject this application?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef5350',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, reject it!'
            });
            if (!result.isConfirmed) return;
        }

        try {
            const updatedApp = await updateApplicationStatus(id, newStatus);
            setApplications(prev => prev.map(app =>
                app._id === id ? updatedApp : app
            ));
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `Application ${newStatus.toLowerCase()} successfully.`,
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error updating application status:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update status'
            });
            // Revert on failure
            setApplications(previousApplications);
        }
    };

    return (
        <Container>
            <Header>
                <Title>Policy Applications</Title>
                <Subtitle>Review and manage policy applications</Subtitle>
            </Header>


            <StatsGrid>
                {/* Pending */}
                <StatCard
                    style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                >
                    <StatLabel style={{ color: '#F59E0B', fontWeight: 'bold' }}>Pending Applications</StatLabel>
                    <StatValue style={{ fontSize: '32px', fontWeight: 'bold' }}>{pendingCount}</StatValue>
                </StatCard>

                {/* Approved */}
                <StatCard
                    style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                >
                    <StatLabel style={{ color: '#10B981', fontWeight: 'bold' }}>Approved</StatLabel>
                    <StatValue style={{ fontSize: '32px', fontWeight: 'bold' }}>{approvedCount}</StatValue>
                </StatCard>

                {/* Rejected */}
                <StatCard
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                >
                    <StatLabel style={{ color: '#EF4444', fontWeight: 'bold' }}>Rejected</StatLabel>
                    <StatValue style={{ fontSize: '32px', fontWeight: 'bold' }}>{rejectedCount}</StatValue>
                </StatCard>
            </StatsGrid>


            <ContentCard>
                <SearchBar style={{ marginBottom: '20px' }}>
                    <Search sx={{ color: 'inherit', fontSize: '20px', opacity: 0.5 }} />
                    <SearchInput
                        placeholder="Search applications by applicant or policy..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBar>

                <TableContainer>
                    <Table>
                        <Thead>
                            <tr>
                                <Th $width="25%">Applicant Name</Th>
                                <Th $width="25%">Policy Name</Th>
                                <Th $width="15%">Date</Th>
                                <Th $width="15%">Status</Th>
                                <Th $width="20%" $align="right">Actions</Th>
                            </tr>
                        </Thead>
                        <tbody>
                            {currentApplications.map((app) => (
                                <Tr key={app._id}>
                                    <Td>
                                        <ApplicantName>{app.userId?.name || 'Unknown User'}</ApplicantName>
                                    </Td>
                                    <Td>{app.policyId?.title || 'Unknown Policy'}</Td>
                                    <Td>{new Date(app.createdAt).toLocaleDateString()}</Td>
                                    <Td>
                                        <StatusBadge $status={app.status?.charAt(0).toUpperCase() + app.status?.slice(1).toLowerCase()}>
                                            {app.status?.charAt(0).toUpperCase() + app.status?.slice(1).toLowerCase()}
                                        </StatusBadge>
                                    </Td>
                                    <Td $align="right">
                                        <ActionsCell>
                                            {/* Slot 1: Approve (Visible) or Ghost (Hidden) */}
                                            <ActionButton
                                                $type="approve"
                                                onClick={() => handleAction(app._id, 'Approved')}
                                                style={{
                                                    visibility: app.status?.toLowerCase() === 'pending' ? 'visible' : 'hidden',
                                                    pointerEvents: app.status?.toLowerCase() === 'pending' ? 'auto' : 'none'
                                                }}
                                            >
                                                <CheckCircleIcon sx={{ fontSize: '18px' }} /> Approve
                                            </ActionButton>

                                            {/* Slot 2: Reject or Undo */}
                                            {app.status?.toLowerCase() === 'pending' ? (
                                                <ActionButton
                                                    $type="reject"
                                                    onClick={() => handleAction(app._id, 'Rejected')}
                                                >
                                                    <CancelIcon sx={{ fontSize: '18px' }} /> Reject
                                                </ActionButton>
                                            ) : (
                                                <ActionButton
                                                    $type="undo"
                                                    onClick={() => handleAction(app._id, 'Pending')}
                                                >
                                                    <Undo sx={{ fontSize: '18px' }} /> Undo
                                                </ActionButton>
                                            )}
                                        </ActionsCell>
                                    </Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>
                    {filteredApplications.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'inherit', opacity: 0.6 }}>
                            No applications found matching "{searchTerm}"
                        </div>
                    )}
                </TableContainer>

                {filteredApplications.length > 0 && (
                    <TablePagination
                        style={{ marginTop: '12px' }}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(entries) => {
                            setEntriesPerPage(entries);
                            setCurrentPage(1);
                        }}
                        totalEntries={totalEntries}
                        startIndex={startIndex}
                        endIndex={endIndex}
                    />
                )}
            </ContentCard>
        </Container>
    );
};

export default Applications;
