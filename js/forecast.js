document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Customer Volume',
                data: [25, 20, 15, 10, 5, 20],
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
                        color: 'white',
                        max: 30 // Setting max value for y-axis
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
        if (year === '2024') {
            chart.data.labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            chart.data.datasets[0].data = [25, 20, 15, 10, 5, 20];
        } else if (year === '2025') {
            chart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            chart.data.datasets[0].data = [10, 15, 20, 25, 30, 25, 20, 15, 10, 5, 30, 5];
        } else if (year === '2026') {
            chart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            chart.data.datasets[0].data = [15, 20, 25, 30, 25, 20, 15, 10, 5, 25, 5, 10];
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
