document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById('menu-button');
    const menuContent = document.getElementById('menu-content');

    menuButton.addEventListener('click', () => {
        menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    });

    // Close the menu if clicked outside
    window.onclick = function(event) {
        if (!event.target.matches('#menu-button')) {
            if (menuContent.style.display === 'block') {
                menuContent.style.display = 'none';
            }
        }
    };

    // Set current date
    const currentDateElement = document.getElementById('current-date');
    const today = new Date();
    const options = { month: 'long', day: 'numeric' };
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);

    // Example appointments
    const appointments = {
        '2024-06-17': [
            { name: 'Roberta Masikap', service: 'Hair Color', time: '10:00 AM' },
            { name: 'Jebron Lames', service: 'Hair Spa', time: '1:00 PM' }
        ]
    };

    const calendarElement = document.getElementById('calendar');
    const appointmentsTodayElement = document.getElementById('appointments-today');

    // Generate calendar
    generateCalendar(calendarElement, today);

    // Display today's appointments
    displayAppointments(appointments, today, appointmentsTodayElement);

    // Logout functionality
    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
        // Implement logout functionality here
        alert('You have been logged out.');
        window.location.href = 'login1.html'; // Redirect to login page
    });
});

function generateCalendar(calendarElement, today) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    let calendarHTML = '<div class="calendar-header">';
    calendarHTML += `<h2>${monthNames[today.getMonth()]}</h2>`;
    calendarHTML += '</div>';
    calendarHTML += '<div class="calendar-body">';
    calendarHTML += '<div class="calendar-grid">';

    for (let day = 1; day <= daysInMonth; day++) {
        calendarHTML += `<div class="calendar-day">${day}</div>`;
    }

    calendarHTML += '</div>';
    calendarHTML += '</div>';
    calendarElement.innerHTML = calendarHTML;
}

function displayAppointments(appointments, today, appointmentsTodayElement) {
    const todayStr = today.toISOString().split('T')[0];
    if (appointments[todayStr]) {
        appointmentsTodayElement.innerHTML = appointments[todayStr].map(app => `
            <div class="appointment">
                <p><strong>Name:</strong> ${app.name}</p>
                <p><strong>Service:</strong> ${app.service}</p>
                <p><strong>Time:</strong> ${app.time}</p>
            </div>
        `).join('');
    } else {
        appointmentsTodayElement.textContent = 'no appointments for today';
    }
}
