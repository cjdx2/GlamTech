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

    // Set current date in the header
    displayHeaderDate();

    // Generate initial calendar
    generateCalendar(document.getElementById('calendar'), currentDate);

    // Fetch and display appointments for the current date
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

    // Update header date at midnight (local time in US settings)
    function updateHeaderDateAtMidnight() {
        const now = new Date();
        const delay = 24 * 60 * 60 * 1000 - now % (24 * 60 * 60 * 1000); // Calculate milliseconds until midnight
        setTimeout(function() {
            displayHeaderDate();
            setInterval(updateHeaderDateAtMidnight, 24 * 60 * 60 * 1000); // Update daily
        }, delay);
    }

    updateHeaderDateAtMidnight();
});

// Function to display today's date in the header
function displayHeaderDate() {
    const currentDateElement = document.getElementById('current-date');
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const now = new Date();
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Function to fetch appointments for a specific date
/// Function to fetch appointments for a specific date
async function fetchAppointments(date = new Date()) {
    
    const dateString = date.toISOString().split('T')[0];
    try {
        const response = await fetch(`../php/fetch_appointments.php?date=${dateString}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const appointments = await response.json();
        appointmentsCache[dateString] = appointments; // Cache appointments by date
        generateCalendar(document.getElementById('calendar'), currentDate); // Regenerate calendar with updated data
        displayAppointments(appointments, dateString);
        
        // Fetch and display confirmed appointments for the selected date
        fetchConfirmedAppointments(date);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}



// Function to update appointment status and send email
async function updateAppointmentStatus(id, status) {
    const isConfirmed = confirm(`Are you sure you want to mark this appointment as ${status}?`);

    if (!isConfirmed) {
        return;
    }

    try {
        const response = await fetch('../php/get_appointment_details.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        const appointment = await response.json();
        if (appointment) {
            const { email, firstname, lastname, date, time } = appointment;

            const updateResponse = await fetch('../php/update_appointments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, status, email, name: `${firstname} ${lastname}`, date, time })
            });

            const result = await updateResponse.json();
            if (result.status === 'success') {
                alert('Appointment has been confirmed and an email has been sent.');

                // Move appointment to confirmed section
                moveAppointmentToConfirmed(id, appointment);

                // Remove appointment from pending list
                removeAppointmentFromPending(id);
            } else {
                alert('Error updating appointment status: ' + result.message);
            }
        } else {
            alert('Error fetching appointment details.');
        }
    } catch (error) {
        alert('Error updating appointment status: ' + error.message);
    }
}

function moveAppointmentToConfirmed(id, appointment) {
    const confirmedAppointmentsList = document.getElementById('confirmed-appointments-list');
    const confirmedRow = document.createElement('div');
    confirmedRow.classList.add('appointment');
    confirmedRow.innerHTML = `
        <p>Name: ${appointment.firstname} ${appointment.lastname}</p>
        <p>Email: ${appointment.email}</p>
        <p>Contact: ${appointment.usercontact}</p>
        <p>Service: ${appointment.service}</p>
        <p>Date: ${appointment.date}</p>
        <p>Time: ${appointment.time}</p>
        <p>Recommended Staff: ${appointment.staff}</p>
        <p>Status: Confirmed</p>
    `;
  
}

function removeAppointmentFromPending(id) {
    const row = document.querySelector(`.confirm-btn[data-id="${id}"]`).closest('tr');
    row.remove();
}



function displayAppointments(appointments, date) {
    const appointmentsTodayElement = document.getElementById('appointments-today');
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);

    const pendingAppointments = appointments.filter(app => app.status !== 'Confirmed');

    if (pendingAppointments.length > 0) {
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
                        <th>Recommended Staff</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${pendingAppointments.map((app, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${app.firstname} ${app.lastname}</td>
                            <td>${app.email}</td>
                            <td>${app.usercontact}</td>
                            <td>${app.service}</td>
                            <td>${app.date}</td>
                            <td>${app.time}</td>
                            <td>${app.staff}</td>
                            <td class="${app.status === 'Confirmed' ? 'status-confirmed' : 'status-pending'}">${app.status || 'Pending'}</td>
                            <td>
                                ${app.status !== 'Confirmed' ? `<button class="confirm-btn" data-id="${app.id}">Confirm</button>` : ''}
                                <button class="delete-btn" data-id="${app.id}">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        appointmentsTodayElement.innerHTML = table;

        // Add event listeners for the Confirm and Delete buttons
        document.querySelectorAll('.confirm-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                const isConfirmed = confirm('Are you sure you want to confirm this appointment?');
                if (isConfirmed) {
                    await updateAppointmentStatus(id, 'Confirmed');
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                const isConfirmed = confirm('Are you sure you want to delete this appointment?');
                if (isConfirmed) {
                    await deleteAppointment(id);
                }
            });
        });
    } else {
        appointmentsTodayElement.innerHTML = `<p>No appointments for ${formattedDate}</p>`;
    }
}


// Function to delete appointment
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

// Function to fetch confirmed appointments for a specific date
// Function to fetch confirmed appointments for a specific date
async function fetchConfirmedAppointments(date = new Date()) {
    const dateString = date.toISOString().split('T')[0];
    try {
        const response = await fetch(`../php/fetch_confirmed_appointments.php?date=${dateString}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const appointments = await response.json();
        displayConfirmedAppointments(appointments, dateString);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


// Function to display confirmed appointments
// Function to display confirmed appointments
function displayConfirmedAppointments(appointments, date) {
    const confirmedAppointmentsElement = document.getElementById('confirmed-appointments');
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);

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
                        <th>Recommended Staff</th>
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
                            <td>${app.staff}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        confirmedAppointmentsElement.innerHTML = table;
    } else {
        confirmedAppointmentsElement.innerHTML = `<p>No confirmed appointments for ${formattedDate}.</p>`;
    }
}


async function fetchPendingAppointments(month, year) {
    try {
        const response = await fetch(`../php/getpendingappointments.php?month=${month}&year=${year}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const adjustedData = {};

        for (const [dateString, count] of Object.entries(data)) {
            const date = new Date(dateString);
            date.setDate(date.getDate() -1); // Adjust date to 1 day ahead
            const adjustedDateString = date.toISOString().split('T')[0];
            adjustedData[adjustedDateString] = count;
        }

        return adjustedData;
    } catch (error) {
        console.error('Failed to fetch pending appointments:', error);
        return {};
    }
}

// Function to generate the calendar
function generateCalendar(calendarElement, date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const today = new Date();
    const isToday = (day) => today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    let calendarHTML = '<div class="calendar-header">';
    calendarHTML += `<h2>${monthNames[currentMonth]} ${currentYear}</h2>`;

    calendarHTML += '<div class="calendar-button">';
    calendarHTML += '<button id="today">Today</button>';
    calendarHTML += '<button id="prev-month">Prev</button>';
    calendarHTML += '<button id="next-month">Next</button>';
    calendarHTML += '</div>';
    calendarHTML += '</div>';

    calendarHTML += '<div class="calendar-body">';
    calendarHTML += '<div class="weekday-header">';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        calendarHTML += `<div>${day}</div>`;
    });
    calendarHTML += '</div>'; // Close day names
    calendarHTML += '<div class="calendar-grid">';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>'; // Empty divs for empty days
    }

    fetchPendingAppointments(currentMonth + 1, currentYear).then(pendingAppointmentsData => {
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
            const todayClass = isToday(day) ? 'today' : '';
            const badgeCount = pendingAppointmentsData[dateString] || 0;
            const badge = badgeCount > 0 ? `<span class="badge">${badgeCount}</span>` : '';
            calendarHTML += `
                <div class="calendar-day ${todayClass}" data-date="${dateString}">
                    ${day}
                    ${badge}
                </div>
            `;
        }

        calendarHTML += '</div>'; // Close calendar grid
        calendarHTML += '</div>'; // Close calendar body
        calendarElement.innerHTML = calendarHTML;

        // Add event listeners for navigation buttons
        document.getElementById('today').addEventListener('click', () => {
            currentDate = new Date();
            generateCalendar(calendarElement, currentDate); // Re-generate calendar with today's date
            fetchAppointments(); // Fetch today's appointments
            
        });

        document.getElementById('prev-month').addEventListener('click', () => {
            const limitDate = new Date('2024-02-01');
            if (currentDate > limitDate) {
                currentDate.setMonth(currentDate.getMonth() - 1);
                generateCalendar(calendarElement, currentDate); // Re-generate calendar with new month
                fetchAppointments(); // Fetch appointments for the new month
            } else {
                console.log("Cannot go back further than February 1, 2024.");
            }
        });

        document.getElementById('next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(calendarElement, currentDate); // Re-generate calendar with new month
            fetchAppointments(); // Fetch appointments for the new month
        });

        // Add click event listener for the days
        document.querySelectorAll('.calendar-day:not(.empty)').forEach(dayElement => {
            dayElement.addEventListener('click', () => {
                const selectedDate = new Date(dayElement.getAttribute('data-date'));
                selectedDate.setDate(selectedDate.getDate() + 1); // Keep the selected date as is
                currentDate = selectedDate;

                const dateString = selectedDate.toISOString().split('T')[0];

                if (appointmentsCache[selectedDate.toISOString().split('T')[0]]) {
                    displayAppointments(appointmentsCache[selectedDate.toISOString().split('T')[0]], selectedDate.toISOString().split('T')[0]);
                } else {
                    fetchAppointments(selectedDate);
                 
                }
                fetchConfirmedAppointments(selectedDate);
            });
        });
    });
}
   



