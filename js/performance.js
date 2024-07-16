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
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
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
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
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
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function toggleMenu() {
        const menuContent = document.getElementById('menu-content');
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    }

    function updateGraphs() {
        const month = document.getElementById('month').value;

        fetch(`../php/logbook_entries.php?month=${month}`)
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(entry => entry.time.startsWith(month));
                const labels = [];
                const servicesData = [];
                const salesData = [];
                const commissionData = [];

                filteredData.forEach(entry => {
                    const index = labels.indexOf(entry.staff);
                    if (index === -1) {
                        labels.push(entry.staff);
                        servicesData.push(1);
                        salesData.push(entry.amount);
                        commissionData.push(entry.commission);
                    } else {
                        servicesData[index]++;
                        salesData[index] += entry.amount;
                        commissionData[index] += entry.commission;
                    }
                });

                servicesChart.data.labels = labels;
                servicesChart.data.datasets[0].data = servicesData;
                servicesChart.update();

                salesChart.data.labels = labels;
                salesChart.data.datasets[0].data = salesData;
                salesChart.update();

                commissionChart.data.labels = labels;
                commissionChart.data.datasets[0].data = commissionData;
                commissionChart.update();
            })
            .catch(error => console.error('Error fetching logbook entries:', error));
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
