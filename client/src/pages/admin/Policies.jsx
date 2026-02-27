import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    Delete,
    Edit,
    Add,
    Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllPolicies, deletePolicy } from '../../api';
import Loader from '../../components/Loader';
import TablePagination from '../../components/TablePagination';
import Swal from 'sweetalert2';

// --- Styled Components ---

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
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
`;

const HeaderText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Title = styled.h1`
    font-size: 26px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
`;

const AddButton = styled.button`
    background-color: ${({ theme }) => theme.primary};
    color: white;
    border: none;
    border-radius: 50px;
    padding: 8px 20px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.primary_hover || theme.primary};
    }
    
    @media screen and (max-width: 768px) {
        padding: 6px 14px;
        font-size: 14px;
        gap: 6px;
    }
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

// Search Bar
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

// Table Styles
const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    padding-bottom: 12px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
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

const PolicyName = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
`;

// Badges
const Badge = styled.div`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
    display: inline-block;
`;

const CategoryBadge = styled(Badge)`
    background: ${({ theme }) => theme.secondary + '15'};
    color: ${({ theme }) => theme.secondary};
`;

const StatusBadge = styled(Badge)`
    background: ${({ $active, theme }) => $active ? theme.green + '15' : theme.text_secondary + '15'};
    color: ${({ $active, theme }) => $active ? theme.green : theme.text_secondary};
`;

// Actions
const ActionsCell = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
`;

const ActionButton = styled.button`
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${({ $type, theme }) =>
        $type === 'delete' ? theme.red + '20' :
            $type === 'edit' ? theme.secondary + '20' :
                $type === 'view' ? theme.primary + '20' :
                    theme.bgLight};
    color: ${({ $type, theme }) =>
        $type === 'delete' ? theme.red :
            $type === 'edit' ? theme.secondary :
                $type === 'view' ? theme.primary :
                    theme.text_secondary};

    &:hover {
        transform: scale(1.05);
        background: ${({ $type, theme }) =>
        $type === 'delete' ? '#ef535030' :
            $type === 'edit' ? '#2196f330' :
                $type === 'view' ? '#ab47bc30' :
                    theme.text_secondary + '20'};
    }
`;


const Policies = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const data = await getAllPolicies();
            setPolicies(data);
        } catch (error) {
            console.error("Error fetching policies:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the policy!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef5350',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deletePolicy(id);
                setPolicies(policies.filter(p => p._id !== id));
                Swal.fire(
                    'Deleted!',
                    'Policy has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error("Error deleting policy:", error);
                Swal.fire(
                    'Error!',
                    'Failed to delete policy.',
                    'error'
                );
            }
        }
    };

    // Filtering & Pagination logic
    const filteredPolicies = policies.filter(policy =>
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalEntries = filteredPolicies.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const currentPolicies = filteredPolicies.slice(startIndex, endIndex);

    return (
        <Container>
            <Header>
                <HeaderText>
                    <Title>Policy Management</Title>
                    <Subtitle>Create and manage insurance policies</Subtitle>
                </HeaderText>
                <AddButton onClick={() => navigate('/admin/add-policy')}>
                    <Add /> Add Policy
                </AddButton>
            </Header>

            <ContentCard>
                <SearchBar style={{ marginBottom: '20px' }}>
                    <Search sx={{ color: 'inherit', fontSize: '20px', opacity: 0.5 }} />
                    <SearchInput
                        placeholder="Search policies by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBar>

                <TableContainer>
                    <Table>
                        <Thead>
                            <tr>
                                <Th $width="40%">Policy Name</Th>
                                <Th $width="20%">Category</Th>
                                <Th $width="20%">Status</Th>
                                <Th $width="20%" $align="right">Actions</Th>
                            </tr>
                        </Thead>
                        <tbody>
                            {currentPolicies.map((policy) => (
                                <Tr key={policy._id}>
                                    <Td>
                                        <PolicyName>{policy.title}</PolicyName>
                                    </Td>
                                    <Td>
                                        <CategoryBadge>{policy.category}</CategoryBadge>
                                    </Td>
                                    <Td>
                                        <StatusBadge $active={policy.isActive}>
                                            {policy.isActive ? 'Active' : 'Inactive'}
                                        </StatusBadge>
                                    </Td>
                                    <Td $align="right">
                                        <ActionsCell>
                                            <ActionButton
                                                $type="edit"
                                                title="Edit Policy"
                                                onClick={() => navigate(`/admin/edit-policy/${policy._id}`)}
                                            >
                                                <Edit sx={{ fontSize: '18px' }} />
                                            </ActionButton>

                                            <ActionButton
                                                $type="delete"
                                                title="Delete Policy"
                                                onClick={() => handleDelete(policy._id)}
                                            >
                                                <Delete sx={{ fontSize: '18px' }} />
                                            </ActionButton>
                                        </ActionsCell>
                                    </Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>
                    {filteredPolicies.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'inherit', opacity: 0.6 }}>
                            No policies found matching "{searchTerm}"
                        </div>
                    )}
                </TableContainer>
                {filteredPolicies.length > 0 && (
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

export default Policies;
