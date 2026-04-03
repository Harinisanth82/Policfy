import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Undo,
    Search,
    Delete
} from '@mui/icons-material';
import { getAllApplications, updateApplicationStatus, bulkDeleteApplications } from '../../api';
import Loader from '../../components/Loader';
import TablePagination from '../../components/TablePagination';
import Swal from 'sweetalert2';

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

    @media (max-width: 768px) {
        overflow-x: hidden;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
    
    @media (max-width: 768px) {
        min-width: 100%;
        display: block;
    }
`;

const Thead = styled.thead`
    border-bottom: 2px solid ${({ theme }) => theme.text_secondary}10;
    
    @media (max-width: 768px) {
        display: none;
    }
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

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        background: ${({ theme }) => theme.bgLight}30;
        border: 1px solid ${({ theme }) => theme.text_secondary}20;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
`;

const Td = styled.td`
    padding: 16px 12px;
    font-size: 14px;
    color: ${({ theme }) => theme.text_primary};
    vertical-align: middle;
    text-align: ${({ $align }) => $align || 'left'};

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 12px 0;
        text-align: left;
        border-bottom: 1px dashed ${({ theme }) => theme.text_secondary}20;
        word-break: break-word;
        width: 100%;
        box-sizing: border-box;
        
        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
            padding-top: 16px;
            margin-top: 4px;
            align-items: flex-end;
        }

        &::before {
            content: attr(data-label);
            font-weight: 700;
            color: ${({ theme }) => theme.text_secondary};
            font-size: 11px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    }
`;

const ApplicantName = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    cursor: pointer;
    transition: color 0.2s ease, text-decoration 0.2s ease;
    
    &:hover {
        color: ${({ theme }) => theme.primary};
        text-decoration: underline;
    }
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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContent = styled.div`
    background: ${({ theme }) => theme.bg === '#000000' ? '#111111' : '#FFFFFF'};
    padding: 32px;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    border: 1px solid ${({ theme }) => theme.text_secondary}20;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    position: relative;
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    color: ${({ theme }) => theme.text_primary};

    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;

const ModalHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const RangeContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 10px;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const DateField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_secondary};
    text-transform: uppercase;
`;

const StyledInput = styled.input`
    padding: 14px 18px;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.text_secondary}30;
    background: ${({ theme }) => theme.bg === '#000000' ? '#000000' : '#F8F9FA'};
    color: ${({ theme }) => theme.text_primary};
    font-family: inherit;
    font-size: 15px;
    outline: none;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
        background: ${({ theme }) => theme.bg === '#000000' ? '#080808' : '#FFFFFF'};
        box-shadow: 0 0 0 4px ${({ theme }) => theme.primary}20;
    }

    &::-webkit-calendar-picker-indicator {
        filter: ${({ theme }) => theme.bg === '#000000' ? 'invert(1)' : 'none'};
        cursor: pointer;
    }
`;

const QuickActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
`;

const QuickChip = styled.button`
    padding: 10px 18px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.text_secondary}25;
    background: ${({ theme }) => theme.bg === '#000000' ? '#1A1A1A' : '#F1F5F9'};
    color: ${({ theme }) => theme.text_secondary};
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
        background: ${({ theme }) => theme.primary}20;
        color: ${({ theme }) => theme.primary};
        border-color: ${({ theme }) => theme.primary}40;
        transform: translateY(-2px);
    }
`;

const Applications = () => {
    const theme = useTheme();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rangeModalOpen, setRangeModalOpen] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: new Date().toISOString().split('T')[0]
    });

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

    const viewDetails = (app) => {
        if (!app.customDetails || Object.keys(app.customDetails).length === 0) {
            Swal.fire('No Insights', 'This application was submitted without answering any dynamic detail questions.', 'info');
            return;
        }
        
        let htmlContent = '<div style="text-align: left; padding: 10px; font-size: 15px;">';
        for (const [key, value] of Object.entries(app.customDetails)) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            htmlContent += `<p style="margin: 0 0 12px 0;"><strong>${formattedKey}:</strong> <span style="color: #555;">${value}</span></p>`;
        }
        htmlContent += '</div>';

        Swal.fire({
            title: 'Applicant Details',
            html: htmlContent,
            icon: 'info',
            confirmButtonColor: '#1976d2',
            confirmButtonText: 'Done'
        });
    };


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
            Toast.fire({
                icon: 'success',
                title: `Application ${newStatus.toLowerCase()} successfully.`
            });
        } catch (error) {
            console.error("Error updating application status:", error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to update status'
            });
            // Revert on failure
            setApplications(previousApplications);
        }
    };

    const handleBulkDeleteSubmit = async () => {
        if (!dateRange.startDate || !dateRange.endDate) {
            Swal.fire('Error', 'Please select both start and end dates', 'error');
            return;
        }

        const confirm = await Swal.fire({
            title: 'Confirm Bulk Deletion',
            text: `Are you sure you want to delete all applications from ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef5350',
            confirmButtonText: 'Yes, Delete Permanently',
            background: theme.bg === '#000000' ? '#111111' : '#FFFFFF',
            color: theme.bg === '#000000' ? '#F1F5F9' : '#111111'
        });

        if (confirm.isConfirmed) {
            setRangeModalOpen(false);
            setLoading(true);
            try {
                const response = await bulkDeleteApplications(dateRange);
                await fetchApplications();
                Swal.fire({
                    title: 'Deleted!',
                    text: response.message,
                    icon: 'success',
                    background: theme.bg === '#000000' ? '#111111' : '#FFFFFF',
                    color: theme.bg === '#000000' ? '#F1F5F9' : '#111111'
                });
            } catch (error) {
                console.error("Error during bulk delete:", error);
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Failed to delete applications',
                    icon: 'error',
                    background: theme.bg === '#000000' ? '#111111' : '#FFFFFF',
                    color: theme.bg === '#000000' ? '#F1F5F9' : '#111111'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const setQuickRange = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        
        setDateRange({
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        });
    };

    const setMonthRange = (monthOffset = 0) => {
        const date = new Date();
        date.setMonth(date.getMonth() - monthOffset);
        
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        setDateRange({
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        });
    };

    return (
        <Container>
            <Header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <Title>Policy Applications</Title>
                        <Subtitle>Review and manage policy applications</Subtitle>
                    </div>
                    <ActionButton
                        $type="reject"
                        onClick={() => setRangeModalOpen(true)}
                        style={{
                            padding: '12px 24px',
                            height: 'auto',
                            width: 'auto',
                            background: '#ef535010',
                            color: '#ef5350',
                            border: '1px solid #ef535025',
                            borderRadius: '12px'
                        }}
                    >
                        <Delete sx={{ fontSize: '22px' }} /> Bulk Cleanup
                    </ActionButton>
                </div>
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
                                    <Td data-label="Applicant Name">
                                        <ApplicantName onClick={() => viewDetails(app)}>
                                            {app.userId?.name || 'Unknown User'}
                                        </ApplicantName>
                                    </Td>
                                    <Td data-label="Policy Name">{app.policyId?.title || 'Unknown Policy'}</Td>
                                    <Td data-label="Date">{new Date(app.createdAt).toLocaleDateString()}</Td>
                                    <Td data-label="Status">
                                        <StatusBadge $status={(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1).toLowerCase()}>
                                            {(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1).toLowerCase()}
                                        </StatusBadge>
                                    </Td>
                                    <Td data-label="Actions" $align="right">
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
            {rangeModalOpen && (
                <ModalOverlay onClick={(e) => e.target === e.currentTarget && setRangeModalOpen(false)}>
                    <ModalContent>
                        <ModalHeader>
                            <Title style={{ fontSize: '22px' }}>Bulk Cleanup</Title>
                            <Subtitle>Select a date range to delete applications permanently</Subtitle>
                        </ModalHeader>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Label style={{ marginBottom: '-8px' }}>Quick Presets</Label>
                            <QuickActions>
                                <QuickChip onClick={() => setQuickRange(1)}>Last 24 Hours</QuickChip>
                                <QuickChip onClick={() => setQuickRange(7)}>Last 7 Days</QuickChip>
                                <QuickChip onClick={() => setQuickRange(30)}>Last 30 Days</QuickChip>
                                <QuickChip onClick={() => setMonthRange(0)}>Current Month</QuickChip>
                                <QuickChip onClick={() => setMonthRange(1)}>Previous Month</QuickChip>
                                <QuickChip onClick={() => setQuickRange(365)}>Last Year</QuickChip>
                            </QuickActions>
                        </div>

                        <RangeContainer>
                            <DateField>
                                <Label>From Date</Label>
                                <StyledInput 
                                    type="date" 
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                                />
                            </DateField>
                            <DateField>
                                <Label>To Date</Label>
                                <StyledInput 
                                    type="date" 
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                                />
                            </DateField>
                        </RangeContainer>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <ActionButton 
                                style={{ background: 'transparent', color: 'inherit', border: '1px solid transparent' }}
                                onClick={() => setRangeModalOpen(false)}
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton 
                                $type="reject"
                                style={{ 
                                    padding: '12px 24px', 
                                    background: '#EF4444', 
                                    color: 'white',
                                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
                                }}
                                onClick={handleBulkDeleteSubmit}
                            >
                                <Delete sx={{ fontSize: '18px' }} /> Delete Range
                            </ActionButton>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default Applications;
