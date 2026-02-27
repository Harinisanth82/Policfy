import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid ${({ theme }) => theme.text_secondary}20;
    flex-wrap: wrap;
    gap: 20px;

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const EntriesSelect = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};

    select {
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid ${({ theme }) => theme.text_secondary}40;
        background: ${({ theme }) => theme.bg};
        color: ${({ theme }) => theme.text_primary};
        outline: none;
        cursor: pointer;

        &:focus {
            border-color: ${({ theme }) => theme.primary};
        }
    }
`;

const PaginationInfo = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
`;

const PageControls = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const PageButton = styled.button`
    padding: 6px 12px;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid ${({ $active, theme }) => $active ? theme.primary : theme.text_secondary + '40'};
    background: ${({ $active, theme }) => $active ? theme.primary : 'transparent'};
    color: ${({ $active, theme }) => $active ? '#fff' : theme.text_primary};
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
    opacity: ${({ disabled }) => disabled ? 0.5 : 1};
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background: ${({ $active, theme }) => $active ? theme.primary : theme.bgLight + '80'};
        border-color: ${({ theme }) => theme.primary};
        color: ${({ $active, theme }) => $active ? '#fff' : theme.text_primary};
    }
`;

const TablePagination = ({
    className,
    style,
    currentPage,
    totalPages,
    onPageChange,
    entriesPerPage,
    onEntriesChange,
    totalEntries,
    startIndex,
    endIndex
}) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 2) {
            endPage = Math.min(totalPages, 5);
        }
        if (currentPage >= totalPages - 1) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <PaginationContainer className={className} style={style}>
            <EntriesSelect>
                Show
                <select
                    value={entriesPerPage}
                    onChange={(e) => onEntriesChange(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                </select>
                entries
            </EntriesSelect>

            <PaginationInfo>
                Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
            </PaginationInfo>

            <PageControls>
                <PageButton
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                >
                    Previous
                </PageButton>

                {getPageNumbers().map(page => (
                    <PageButton
                        key={page}
                        $active={currentPage === page}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </PageButton>
                ))}

                <PageButton
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                >
                    Next
                </PageButton>
            </PageControls>
        </PaginationContainer>
    );
};

export default TablePagination;
