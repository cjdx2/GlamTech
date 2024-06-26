document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Customer Volume',
                data: [30, 50, 45, 70, 80, 60, 90, 100, 95, 110, 105, 120],
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'white'
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true
        }
    });

    document.getElementById('year').addEventListener('change', function() {
        updateChart();
    });

    function updateChart() {
        const year = document.getElementById('year').value;
        // Update the chart data based on the selected year
        // This is just a dummy example, replace with actual data retrieval logic
        if (year === '2022') {
            chart.data.datasets[0].data = [20, 40, 35, 60, 70, 50, 80, 90, 85, 100, 95, 110];
        } else if (year === '2023') {
            chart.data.datasets[0].data = [30, 50, 45, 70, 80, 60, 90, 100, 95, 110, 105, 120];
        } else if (year === '2024') {
            chart.data.datasets[0].data = [40, 60, 55, 80, 90, 70, 100, 110, 105, 120, 115, 130];
        }
        chart.update();
    }
});

// Include the logbook functionality for date and menu
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById('menu-button');
    const menuContent = document.getElementById('menu-content');

    // Update the date
    const dateElement = document.getElementById('current-date');
    const yearElement = document.getElementById('current-year');
    const now = new Date();
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    const year = now.getFullYear();

    dateElement.textContent = formattedDate;
    yearElement.textContent = year;

    menuButton.addEventListener('click', () => {
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    });

    window.onclick = function(event) {
        if (!event.target.matches('#menu-button')) {
            if (menuContent.style.display === 'block') {
                menuContent.style.display = 'none';
            }
        }
    };
});
