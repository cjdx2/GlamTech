document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById('menu-button');
    const menuContent = document.getElementById('menu-content');
    const form = document.getElementById('logbook-form'); // Added form variable

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

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        fetch('../php/logbook.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log('Logbook form submission response:', data);
            loadEntries();  // Reload entries after submission
            form.reset();  // Optionally clear form fields after submission
        })
        .catch(error => {
            console.error('Error submitting logbook form:', error);
            alert('Failed to submit logbook form. Please try again.');
        });
    });

    function loadEntries() {
        fetch('../php/logbook_entries.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Handle successful response
                const logbookEntries = document.getElementById('logbook-entries');
                logbookEntries.innerHTML = '';
                let totalAmountSum = 0;
                let totalCommissionSum = 0;

                data.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${entry.staff}</td>
                        <td>${entry.service}</td>
                        <td>${entry.amount}</td>
                        <td>${entry.commission}</td>
                        <td>${entry.time}</td>
                        <td><button class="edit" data-id="${entry.id}">Edit</button></td>
                    `;
                    logbookEntries.appendChild(row);

                    totalAmountSum += parseFloat(entry.amount);
                    totalCommissionSum += parseFloat(entry.commission);
                });

                const totalAmount = document.getElementById('total-amount');
                const totalCommission = document.getElementById('total-commission');

                totalAmount.textContent = totalAmountSum.toFixed(2);
                totalCommission.textContent = totalCommissionSum.toFixed(2);

                // Re-add event listeners for edit buttons
                logbookEntries.querySelectorAll(".edit").forEach(button => {
                    button.addEventListener("click", handleEditClick);
                });
            })
            .catch(error => {
                // Handle fetch errors
                console.error('Error fetching logbook entries:', error);
                alert('Failed to load logbook entries. Please try again.');
            });
    }

    // Initial load of entries
    loadEntries();

    // Handle edit button click
    function handleEditClick(event) {
        const button = event.target;
        const row = button.closest("tr");
        const cells = row.querySelectorAll("td");

        cells.forEach((cell, index) => {
            if (index < cells.length - 1) {
                const currentText = cell.innerText;
                cell.innerHTML = `<input type="text" value="${currentText}">`;
            }
        });

        button.innerText = "Save";
        button.classList.remove("edit");
        button.classList.add("save");

        button.removeEventListener('click', handleEditClick);
        button.addEventListener('click', handleSaveClick);
    }

    function handleSaveClick(event) {
        const button = event.target;
        const entryId = button.dataset.id; // Retrieve entryId from button dataset

        const row = button.closest("tr");
        const inputs = row.querySelectorAll("input");

        let isValid = true;
        const updatedData = {};

        inputs.forEach((input, index) => {
            const newText = input.value;
            const cell = input.closest("td");
            if ((index === 2 || index === 3) && !/^\d+(\.\d{1,2})?$/.test(newText)) { // Validate Amount and Commission
                alert("Invalid input. Please enter a number for Amount and Commission.");
                isValid = false;
                return;
            }
            cell.innerHTML = newText;

            // Add the updated data to the object
            switch(index) {
                case 0: updatedData.staff = newText; break;
                case 1: updatedData.service = newText; break;
                case 2: updatedData.amount = parseFloat(newText); break;
                case 3: updatedData.commission = parseFloat(newText); break;
                case 4: updatedData.time = newText; break;
            }
        });

        if (isValid) {
            fetch(`../php/update_logbook_entries.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: entryId, // Use retrieved entryId
                    staff: updatedData.staff,
                    service: updatedData.service,
                    amount: updatedData.amount,
                    commission: updatedData.commission,
                    time: updatedData.time
                })
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                if (data === "success") {
                    button.innerText = "Edit";
                    button.classList.remove("save");
                    button.classList.add("edit");

                    button.removeEventListener('click', handleSaveClick);
                    button.addEventListener('click', handleEditClick);

                    updateTotals();
                    loadEntries();  // Reload entries after successful save
                } else {
                    alert("Failed to save data.");
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    function updateTotals() {
        const rows = document.querySelectorAll("tbody tr");
        let totalAmountSum = 0;
        let totalCommissionSum = 0;

        rows.forEach(row => {
            const amount = parseFloat(row.cells[2].innerText);
            const commission = parseFloat(row.cells[3].innerText);

            totalAmountSum += amount;
            totalCommissionSum += commission;
        });

        const totalAmount = document.getElementById('total-amount');
        const totalCommission = document.getElementById('total-commission');

        totalAmount.textContent = totalAmountSum.toFixed(2);
        totalCommission.textContent = totalCommissionSum.toFixed(2);
    }

    // Staff availability for each service
    const staffForService = {
        'haircut': ['Wendell', 'Jirven', 'Joane'],
        'shampoowithblowdry': ['Wendell', 'Jirven', 'Joane'],
        'hairiron': ['Wendell', 'Jirven', 'Joane'],
        'haircolor': ['Wendell', 'Jirven', 'Joane'],
        'highlights': ['Wendell', 'Jirven', 'Joane'],
        'manicure': ['Rosalie', 'Mernalyn'],
        'pedicure': ['Rosalie', 'Mernalyn'],
        'gelpolishmanicure': ['Rosalie', 'Mernalyn'],
        'gelpolish': ['Rosalie', 'Mernalyn'],
        'footspa': ['Rosalie', 'Mernalyn'],
        'premiumfootspa': ['Rosalie', 'Mernalyn'],
        'hotoil': ['Wendell', 'Jirven', 'Joane'],
        'hairmask': ['Wendell', 'Jirven', 'Joane'],
        'hairspa': ['Wendell', 'Jirven', 'Joane'],
        'semidlino': ['Wendell', 'Jirven', 'Joane'],
        'cellophane': ['Wendell', 'Jirven', 'Joane'],
        'coldwave': ['Wendell', 'Jirven', 'Joane']
    };

    const serviceDropdowns = document.querySelectorAll('.service-dropdown'); // Adjusted selector to target all service dropdowns
    const staffDropdown = document.getElementById('staff');

    staffDropdown.addEventListener('change', function() {
        const selectedStaff = this.value;

        serviceDropdowns.forEach(serviceDropdown => {
            const options = serviceDropdown.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const serviceName = option.value;
                const isHandledByStaff = staffForService[serviceName].includes(selectedStaff);
                option.disabled = !isHandledByStaff;
            }
        });
    });
});
