let currentDate = new Date(); // Global variable to track the currently displayed date
let appointmentsCache = {}; // Cache for appointments

document.addEventListener("DOMContentLoaded", () => {
    // Menu button toggle
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
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    displayCurrentDate();

    // Generate initial calendar
    generateCalendar(document.getElementById('calendar'), currentDate);

    // Fetch and display appointments for today
    fetchAppointments();

    // Logout functionality
    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
        alert('You have been logged out.');
        window.location.href = 'login.html'; // Redirect to login page
    });

    // Logbook redirection
    const logbookButton = document.getElementById('logbook');
    logbookButton.addEventListener('click', () => {
        window.location.href = 'logbook.html';
    });

    // Update date at midnight (local time in US settings)
    function updateDateAtMidnight() {
        const now = new Date();
        const delay = 24 * 60 * 60 * 1000 - now % (24 * 60 * 60 * 1000); // Calculate milliseconds until midnight
        setTimeout(function() {
            displayCurrentDate();
            setInterval(updateDateAtMidnight, 24 * 60 * 60 * 1000); // Update daily
        }, delay);
    }
    
    updateDateAtMidnight();
});

// Function to display today's date beside the logo
function displayCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    
    // Get current date in local time (in US settings, for example)
    const now = new Date();
    
    // Display current date
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

async function fetchAppointments(date = new Date().toISOString().split('T')[0]) {
    try {
        const response = await fetch(`../php/fetch_appointments.php?date=${date}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const appointments = await response.json();
        
        // Cache appointments by date
        appointmentsCache[date] = appointments;

        displayAppointments(appointments, date);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayAppointments(appointments, date) {
    const appointmentsTodayElement = document.getElementById('appointments-today');
    if (appointments.length > 0) {
        const table = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.map((app, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${app.firstname} ${app.lastname}</td>
                            <td>${app.email}</td>
                            <td>${app.usercontact}</td>
                            <td>${app.service}</td>
                            <td>${app.date}</td>
                            <td>${app.time}</td>
                            <td class="${app.status === 'Confirmed' ? 'status-confirmed' : 'status-pending'}">${app.status || 'Pending'}</td>
                            <td>
                                <button class="confirm-btn" data-id="${app.id}">Confirm</button>
                                <button class="delete-btn" data-id="${app.id}">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        appointmentsTodayElement.innerHTML = table;

        // Add event listeners for buttons
        document.querySelectorAll('.confirm-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const appointmentId = e.target.getAttribute('data-id');
                await updateAppointmentStatus(appointmentId, 'Confirmed');
                fetchAppointments(date); // Refresh the appointments
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const appointmentId = e.target.getAttribute('data-id');
                await deleteAppointment(appointmentId);
                fetchAppointments(date); // Refresh the appointments
            });
        });
    } else {
        appointmentsTodayElement.innerHTML = 'No appointments for ' + date;
    }
}

async function updateAppointmentStatus(id, status) {
    try {
        const response = await fetch(`../php/update_appointment.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, status })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error updating appointment status:', error);
    }
}

async function deleteAppointment(id) {
    try {
        const response = await fetch(`../php/delete_appointment.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
    }
}

function generateCalendar(calendarElement, date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    // Set calendar header
    let calendarHTML = '<div class="calendar-header">';
    calendarHTML += `<h2>${monthNames[currentMonth]} ${currentYear}</h2>`;
    calendarHTML += '<button id="today">Today</button>';
    calendarHTML += '<button id="prev-month">Prev</button>';
    calendarHTML += '<button id="next-month">Next</button>';
    calendarHTML += '</div>';
    
    calendarHTML += '<div class="calendar-body">';
    calendarHTML += '<div class="weekday-header">';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        calendarHTML += `<div>${day}</div>`;
    });
    calendarHTML += '</div>'; // Close day names
    calendarHTML += '<div class="calendar-grid">';

    // Get the first day of the month and how many days are in the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Fill in the empty days for the start of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>'; // Empty divs for empty days
    }

    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0]; // YYYY-MM-DD format
        calendarHTML += `
            <div class="calendar-day" data-date="${dateString}">
                ${day}
            </div>
        `;
    }
    
    calendarHTML += '</div>'; // Close calendar grid
    calendarHTML += '</div>'; // Close calendar body
    calendarElement.innerHTML = calendarHTML;

    // Add event listeners for navigation buttons
    document.getElementById('today').addEventListener('click', () => {
        currentDate = new Date();
        generateCalendar(document.getElementById('calendar'), currentDate); // Regenerate calendar
        fetchAppointments(); // Fetch today's appointments
    });

    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(calendarElement, currentDate);
        fetchAppointments(currentDate.toISOString().split('T')[0]); // Fetch appointments for the new month
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(calendarElement, currentDate);
        fetchAppointments(currentDate.toISOString().split('T')[0]); // Fetch appointments for the new month
    });

    // Add click event listener for the days
    document.querySelectorAll('.calendar-day:not(.empty)').forEach(dayElement => {
        dayElement.addEventListener('click', () => {
            const selectedDate = new Date(dayElement.getAttribute('data-date'));
            selectedDate.setDate(selectedDate.getDate() + 1); // Add one day to the selected date
            currentDate = selectedDate;
    
            // Update the displayed date
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            document.getElementById('current-date').textContent = selectedDate.toLocaleDateString('en-US', options);
    
            if (appointmentsCache[selectedDate.toISOString().split('T')[0]]) {
                displayAppointments(appointmentsCache[selectedDate.toISOString().split('T')[0]], selectedDate.toISOString().split('T')[0]);
            } else {
                fetchAppointments(selectedDate.toISOString().split('T')[0]);
            } 
        });
    }); 
}
