import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    Search,
    Delete,
    Edit
} from '@mui/icons-material';
import { getAllUsers, deleteUser, updateUser } from '../../api';
import Loader from '../../components/Loader';
import TablePagination from '../../components/TablePagination';
import Swal from 'sweetalert2';



const Container = styled.div`
    padding: 30px;
    background: ${({ theme }) => theme.bgLight || '#f4f6f8'};
    display: flex;
    flex-direction: column;
    gap: 24px;
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
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
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
    box-sizing: border-box; // Ensure padding is included in width

    @media (max-width: 768px) {
        max-width: 100%; // Ensure it takes full width on mobile
        padding: 10px 14px; // Slightly reduce padding
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


const FiltersContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
    }
`;

const FilterCard = styled.div`
    flex: 1;
    background: ${({ $active, theme }) => $active ? theme.primary + '10' : theme.bgLight};
    border: 2px solid ${({ $active, theme }) => $active ? theme.primary : 'transparent'};
    border-radius: 12px;
    padding: 16px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
    box-shadow: ${({ $active }) => $active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'};

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        background: ${({ $active, theme }) => $active ? theme.primary + '15' : theme.bgLight + '80'};
    }
`;

const FilterInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const FilterTitle = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${({ $active, theme }) => $active ? theme.primary : theme.text_primary};
`;

const FilterDesc = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.text_secondary};
`;

const FilterCount = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${({ $active, theme }) => $active ? theme.primary : theme.text_primary};
`;


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




const UserName = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
`;




const StatusBadge = styled.div`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
    background: ${({ $active, theme }) => ($active ? theme.green + '15' : theme.text_secondary + '15')};
    color: ${({ $active, theme }) => ($active ? theme.green : theme.text_secondary)};
`;


const ActionsCell = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
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
        $type === 'delete' ? '#ef535020' :
            $type === 'accept' ? '#00ff6a20' :
                theme.bgLight || '#f8f9fa'};
    color: ${({ $type, theme }) =>
        $type === 'delete' ? '#ef5350' :
            $type === 'accept' ? '#00ff6a' :
                theme.text_secondary};

    &:hover {
        transform: scale(1.05);
        background: ${({ $type, theme }) =>
        $type === 'delete' ? '#ef535030' :
            $type === 'accept' ? '#00ff6a30' :
                theme.text_secondary + '20'};
    }
`;



const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: ${({ theme }) => theme.card};
    padding: 32px;
    border-radius: 16px;
    width: 100%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    border: 1px solid ${({ theme }) => theme.text_secondary}20;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    color: ${({ theme }) => theme.text_primary};
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const ModalTitle = styled.h2`
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 0;
`;

const ModalForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_secondary};
`;

const Input = styled.input`
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    background: ${({ theme }) => theme.bgLight || '#f8f9fa'};
    color: ${({ theme }) => theme.text_primary};
    font-size: 15px;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}15;
    }
`;

const Select = styled.select`
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    background: ${({ theme }) => theme.bgLight || '#f8f9fa'};
    color: ${({ theme }) => theme.text_primary};
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
    }
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
`;

const CancelButton = styled.button`
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    background: transparent;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${({ theme }) => theme.text_secondary}10;
    }
`;

const SaveButton = styled.button`
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    background: ${({ theme }) => theme.primary};
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 10px ${({ theme }) => theme.primary}30;

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 6px 15px ${({ theme }) => theme.primary}40;
    }

    &:active {
        transform: translateY(0);
    }
`;


const Users = () => {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('user'); // 'admin' or 'user'

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: ''
    });


    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    useEffect(() => {
        // Reset to first page when search or tab changes
        setCurrentPage(1);
    }, [searchTerm, activeTab]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
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
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef5350',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                setUsers(users.filter(user => user._id !== id));
                Swal.fire(
                    'Deleted!',
                    'User has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire(
                    'Error!',
                    'Failed to delete user.',
                    'error'
                );
            }
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role
        });
        setEditModalOpen(true);
    };

    const handleEditSave = async () => {
        try {
            const updated = await updateUser(selectedUser._id, editForm);
            setUsers(users.map(user => user._id === selectedUser._id ? { ...user, ...updated } : user));
            setEditModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'User details updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error updating user:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update user details.'
            });
        }
    };


    const roleFilteredUsers = users.filter(user => user.role === activeTab);
    const filteredUsers = roleFilteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const totalEntries = filteredUsers.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const adminCount = users.filter(user => user.role === 'admin').length;
    const userCount = users.filter(user => user.role === 'user').length;

    return (
        <Container>
            <Header>
                <Title>Members Management</Title>
                <Subtitle>Manage and monitor all system members</Subtitle>
            </Header>

            <FiltersContainer>
                <FilterCard
                    $active={activeTab === 'admin'}
                    onClick={() => setActiveTab('admin')}
                >
                    <FilterInfo>
                        <FilterTitle $active={activeTab === 'admin'}>Administrators</FilterTitle>
                        <FilterDesc>Manage admin accounts</FilterDesc>
                    </FilterInfo>
                    <FilterCount $active={activeTab === 'admin'}>{adminCount}</FilterCount>
                </FilterCard>
                <FilterCard
                    $active={activeTab === 'user'}
                    onClick={() => setActiveTab('user')}
                >
                    <FilterInfo>
                        <FilterTitle $active={activeTab === 'user'}>Users</FilterTitle>
                        <FilterDesc>Manage regular users</FilterDesc>
                    </FilterInfo>
                    <FilterCount $active={activeTab === 'user'}>{userCount}</FilterCount>
                </FilterCard>
            </FiltersContainer>

            <ContentCard>
                <SearchBar>
                    <Search sx={{ color: 'inherit', fontSize: '20px', opacity: 0.5 }} />
                    <SearchInput
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBar>

                <TableContainer>
                    <Table>
                        <Thead>
                            <tr>
                                <Th $width="20%">Name</Th>
                                <Th $width="40%">Email</Th>
                                <Th $width="20%">Status</Th>
                                <Th $width="20%" $align="right">Actions</Th>
                            </tr>
                        </Thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <Tr key={user._id}>
                                    <Td>
                                        <UserName>{user.name}</UserName>
                                    </Td>
                                    <Td>{user.email}</Td>
                                    <Td>
                                        <StatusBadge $active={true}>
                                            Active
                                        </StatusBadge>
                                    </Td>
                                    <Td $align="right">
                                        <ActionsCell>
                                            <ActionButton
                                                $type="edit"
                                                title="Edit User"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                <Edit sx={{ fontSize: '18px' }} />
                                            </ActionButton>
                                            {user.email !== 'admin@example.com' && user._id !== currentUser?._id && (
                                                <ActionButton
                                                    $type="delete"
                                                    title="Delete User"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <Delete sx={{ fontSize: '18px' }} />
                                                </ActionButton>
                                            )}
                                        </ActionsCell>
                                    </Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>
                    {filteredUsers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'inherit', opacity: 0.6 }}>
                            No users found matching "{searchTerm}"
                        </div>
                    )}
                </TableContainer>
                {filteredUsers.length > 0 && (
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

            {/* Simple Edit Modal */}
            {editModalOpen && (
                <ModalOverlay onClick={(e) => e.target === e.currentTarget && setEditModalOpen(false)}>
                    <ModalContent>
                        <ModalTitle>Edit Member</ModalTitle>
                        <ModalForm>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Role</Label>
                                <Select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Select>
                            </FormGroup>
                        </ModalForm>
                        <ModalActions>
                            <CancelButton onClick={() => setEditModalOpen(false)}>
                                Cancel
                            </CancelButton>
                            <SaveButton onClick={handleEditSave}>
                                Save Changes
                            </SaveButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default Users;
