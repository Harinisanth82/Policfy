import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 250px;
    padding-top: 20px;
    gap: 16px;
`;

const BarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    height: 100%;
    justify-content: flex-end;
`;

const Bar = styled.div`
    width: 100%;
    max-width: 60px;
    height: ${({ $height }) => $height};
    background: #00C49F; // Teal color
    border-radius: 6px 6px 0 0;
    transition: height 1s ease-in-out, background 0.3s ease;
    
    &:hover {
        background: #00a887; // Slightly darker teal for hover
    }
`;

const Label = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
    font-weight: 500;
`;

const ActivityTrendChart = ({ data = [] }) => {

    // Determine max value for scaling (normalization)
    const maxValue = Math.max(...data.map(item => item.value), 1); // Avoid division by zero

    return (
        <ChartContainer>
            {data.map((item, index) => {
                const heightPercentage = (item.value / maxValue) * 100;
                // Min height for visibility if value > 0
                const displayHeight = item.value > 0 ? Math.max(heightPercentage, 5) + '%' : '0%';

                return (
                    <BarWrapper key={index}>
                        <Bar $height={displayHeight} title={`${item.label}: ${item.value}`} />
                        <Label>{item.label}</Label>
                    </BarWrapper>
                );
            })}
        </ChartContainer>
    );
};

export default ActivityTrendChart;
