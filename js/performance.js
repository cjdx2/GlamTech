const ctx = document.getElementById('performanceChart').getContext('2d');

let performanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Employee 1', 'Employee 2', 'Employee 3', 'Employee 4', 'Employee 5', 'Employee 6'],
        datasets: [
            {
                label: 'Services',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'orange'
            },
            {
                label: 'Sales',
                data: [2, 3, 20, 5, 1, 4],
                backgroundColor: 'red'
            },
            {
                label: 'Commission',
                data: [3, 10, 13, 15, 22, 30],
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

function updateGraph() {
    const month = document.getElementById('month').value;
    // Fetch and update data based on the selected month
    // This is a placeholder for actual data fetching logic
    performanceChart.data.datasets[0].data = [Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20];
    performanceChart.data.datasets[1].data = [Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20];
    performanceChart.data.datasets[2].data = [Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20];
    performanceChart.update();
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
