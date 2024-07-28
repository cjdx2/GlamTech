document.addEventListener("DOMContentLoaded", () => {
    const servicesCtx = document.getElementById('servicesChart').getContext('2d');
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const commissionCtx = document.getElementById('commissionChart').getContext('2d');

    let servicesChart = new Chart(servicesCtx, {
        type: 'bar',
        data: {
            labels: [], // Will be populated dynamically
            datasets: [
                {
                    label: 'Number of Services',
                    data: [],
                    backgroundColor: 'orange'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    let salesChart = new Chart(salesCtx, {
        type: 'bar',
        data: {
            labels: [], // Will be populated dynamically
            datasets: [
                {
                    label: 'Sales',
                    data: [],
                    backgroundColor: 'red'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    let commissionChart = new Chart(commissionCtx, {
        type: 'bar',
        data: {
            labels: [], // Will be populated dynamically
            datasets: [
                {
                    label: 'Commission',
                    data: [],
                    backgroundColor: 'yellow'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    const commissionRates = {
        "Manicure": 0.50,
        "Pedicure": 0.50,
        "Foot Spa": 0.50,
        "Foot Massage": 0.50,
        "Gel Polish": 0.50,
        "Makeup": 0.50,
        "Shave w/ Shampoo": 0.50,
        "Eyebrow Shave": 0.50,
        "Brazilian": 0.50,
        "Wax": 0.50,
        "Massage": 0.50,
        "Male Haircut": 0.40,
        "Female Haircut": 0.40,
        "Haircut": 0.40,
        "Haircut w/ Brazilian": 0.40,
        "Male Haircut w/ Shampoo": 0.40,
        "Female Haircut w/ Shampoo": 0.40,
        "Female Haircut w/ Treatment": 0.40,
        "Haircut w/ Shampoo": 0.40,
        "Shampoo": 0.40,
        "Conditioner": 0.40,
        "Blow Dry": 0.40,
        "Shampoo w/ Blow Dry": 0.40,
        "Hair & Makeup": 0.40,
        "Hair Style": 0.40,
        "Hair Color": 0.40,
        "Highlights": 0.40,
        "Hair Color w/ Brazilian": 0.40,
        "Hair Color w/ Treatment": 0.40,
        "Hair Color w/ Rebond": 0.40,
        "Hair Color w/ Semi D' Lino": 0.40,
        "Hair Color w/ Haircut": 0.40,
        "Hair Treatment": 0.40,
        "Hair Spa": 0.40,
        "Hot Oil": 0.40,
        "Hair Iron": 0.40,
        "Hair Curl w/ Brazilian": 0.40,
        "Hair Curl": 0.40,
        "Keratin": 0.40,
        "Rebond": 0.40,
        "Rebond w/ Roots": 0.40,
        "Rebond w/ Treatment": 0.40,
        "Rebond w/ Color": 0.40,
        "Rebond w/ Semi D' Lino": 0.40,
        "Semi D' Lino": 0.40,
        "Semi D' Lino w/ Brazilian": 0.40,
    };

    function toggleMenu() {
        const menuContent = document.getElementById('menu-content');
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    }

    function updateGraphs() {
        const month = document.getElementById('month').value;
        console.log(`Fetching data for month: ${month}`);

        fetch(`../php/logbook_entries.php?month=${month}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data fetched successfully:', data);
                const filteredData = data.filter(entry => entry.datetime.startsWith(month));
                const staffLabels = [];
                const servicesData = [];
                const salesData = [];
                const commissionData = [];

                const staffData = {};

                filteredData.forEach(entry => {
                    const commissionRate = getCommissionRate(entry.service);
                    const commissionAmount = entry.amount * commissionRate;

                    if (!staffData[entry.staff]) {
                        staffData[entry.staff] = {
                            serviceCount: 0,
                            totalSales: 0,
                            totalCommission: 0
                        };
                    }

                    staffData[entry.staff].serviceCount++;
                    staffData[entry.staff].totalSales += parseFloat(entry.amount);
                    staffData[entry.staff].totalCommission += parseFloat(commissionAmount);
                });

                // Organize data for the charts
                for (const staff in staffData) {
                    staffLabels.push(staff);
                    servicesData.push(staffData[staff].serviceCount);
                    salesData.push(staffData[staff].totalSales);
                    commissionData.push(staffData[staff].totalCommission);
                }

                console.log('Staff Labels:', staffLabels);
                console.log('Services Data:', servicesData);
                console.log('Sales Data:', salesData);
                console.log('Commission Data:', commissionData);

                // Update Services Chart
                servicesChart.data.labels = staffLabels;
                servicesChart.data.datasets[0].data = servicesData;
                servicesChart.update();

                // Update Sales Chart
                salesChart.data.labels = staffLabels;
                salesChart.data.datasets[0].data = salesData;
                salesChart.update();

                // Update Commission Chart
                commissionChart.data.labels = staffLabels;
                commissionChart.data.datasets[0].data = commissionData;
                commissionChart.update();
            })
            .catch(error => console.error('Error fetching logbook entries:', error));
    }

    function getCommissionRate(service) {
        return commissionRates[service] || 0;
    }

    function displayDate() {
        const dateElement = document.getElementById('current-date');
        const yearElement = document.getElementById('current-year');
        const currentDate = new Date();
        const dateOptions = { day: 'numeric', month: 'long' };
        const yearOptions = { year: 'numeric' };

        dateElement.textContent = currentDate.toLocaleDateString('en-US', dateOptions);
        yearElement.textContent = currentDate.toLocaleDateString('en-US', yearOptions);
    }

    displayDate();
    document.getElementById('menu-button').addEventListener('click', toggleMenu);
    document.getElementById('month').addEventListener('change', updateGraphs);

    updateGraphs(); // Initial graph update
});
