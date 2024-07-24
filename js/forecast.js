document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Customer Volume',
                data: [],
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
                        display: true,
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
                        max: 1000
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'white'
                    }
                }
            },
            responsive: true
        }
    });

    function updateChart(year) {
        fetch(`http://127.0.0.1:5000/forecast?year=${year}`)
            .then(response => response.json())
            .then(data => {
                chart.data.labels = data.labels;
                chart.data.datasets[0].data = data.data;
                chart.update();
                updateSummary(data.data, year);
            })
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function updateSummary(data, year) {
        const summaryContainer = document.getElementById('summary-container');
        let total = data.reduce((a, b) => a + b, 0);
        let avg = total / data.length;
        let min = Math.min(...data);
        let max = Math.max(...data);

        summaryContainer.innerHTML = `
            <h3>Summary for ${year}</h3>
            <p>Total Customer Volume: ${total}</p>
            <p>Average Monthly Volume: ${avg.toFixed(2)}</p>
            <p>Highest Month: ${max}</p>
            <p>Lowest Month: ${min}</p>
        `;
    }

    document.getElementById('year').addEventListener('change', function() {
        const year = this.value;
        updateChart(year);
    });

    updateChart(document.getElementById('year').value);

    const menuButton = document.getElementById('menu-button');
    const menuContent = document.getElementById('menu-content');

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
