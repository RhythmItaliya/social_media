import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import config from '../../configuration';
import { Button, Table, Select } from 'antd';
import './chart.css';

const { Option } = Select;

const UserGraph = () => {
    const [userData, setUserData] = useState([]);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [accountData, setAccountData] = useState([]);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('bar');

    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/admins/admin/users/recode`);
                const data = await response.json();
                setUserData(data);
                setTotalAccounts(data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!userData || userData.length === 0) return;

        const filteredData = userData.filter(entry => {
            const entryDate = new Date(entry.createdAt);
            return entryDate.getMonth() + 1 === selectedMonth && entryDate.getFullYear() === selectedYear;
        });

        const groupedData = {};
        filteredData.forEach(entry => {
            const entryDate = new Date(entry.createdAt);
            const dateKey = entryDate.toISOString().split('T')[0];
            groupedData[dateKey] = (groupedData[dateKey] || 0) + 1;
        });

        const labels = getDaysInMonth(selectedYear, selectedMonth).map(day => `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
        const data = labels.map(date => groupedData[date] || 0);

        setAccountData(data);
    }, [userData, selectedMonth, selectedYear]);

    useEffect(() => {
        if (!accountData || accountData.length === 0) return;

        if (chartRef.current === null) {
            renderChart();
        } else {
            updateChart();
        }
    }, [accountData, chartType]);

    const renderChart = () => {
        const ctx = document.getElementById('chartCanvas');
        chartRef.current = new Chart(ctx, {
            type: chartType,
            data: {
                labels: getDaysInMonth(selectedYear, selectedMonth).map(day => day.toString().padStart(2, '0')),
                datasets: [{
                    label: "Accounts Created",
                    data: accountData,
                    backgroundColor: 'rgba(105, 0, 132, .2)',
                    borderColor: 'rgba(200, 99, 132, .7)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    const updateChart = () => {
        const chart = chartRef.current;
        chart.config.type = chartType;
        chart.data.datasets[0].data = accountData;
        chart.data.labels = getDaysInMonth(selectedYear, selectedMonth).map(day => day.toString().padStart(2, '0'));
        chart.update();
    };

    const toggleChartType = () => {
        setChartType(chartType === 'bar' ? 'pie' : 'bar');
    };

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, i) => 2010 + i);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => (
                <span>{text}</span>
            ),
        },
        {
            title: 'Accounts Created',
            dataIndex: 'accountsCreated',
            key: 'accountsCreated',
        },
    ];

    const accountDataFormatted = getDaysInMonth(selectedYear, selectedMonth).map((day, index) => ({
        key: index,
        date: `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        accountsCreated: accountData[index],
    }));

    return (
        <>
            <div className="container">
                <h2 className='card p-2 w-25 text-center mx-auto'>Users Recodes</h2>
                <div className='d-flex flex-wrap justify-content-center align-content-center mb-5'>
                    <div className="chart-container mt-3">
                        <canvas id="chartCanvas"></canvas>
                    </div>

                    {error && <div>{error}</div>}

                    <div className='chart-container mt-3'>
                        {accountData.length > 0 ? (
                            <Table columns={columns} dataSource={accountDataFormatted} pagination={{ pageSize: 6 }} />
                        ) : (
                            <div>No data found for the selected month and year</div>
                        )}
                    </div>
                </div>

                <div className="chart-data-container p-3 d-flex align-items-center justify-content-between">
                    <div>
                        <Select value={selectedMonth} onChange={value => setSelectedMonth(value)}>
                            {months.map(month => (
                                <Option key={month} value={month}>
                                    {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                                </Option>
                            ))}
                        </Select>
                        <Select value={selectedYear} onChange={value => setSelectedYear(value)}>
                            {years.map(year => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>Total Accounts: {totalAccounts}</div>
                    <Button onClick={toggleChartType}>{chartType === 'bar' ? 'Switch to Pie Chart' : 'Switch to Bar Chart'}</Button>
                </div>
            </div>
        </>
    );
};

export default UserGraph;

function getDaysInMonth(year, month) {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() + 1 === month) {
        days.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }
    return days;
}
