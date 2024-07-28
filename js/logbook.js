document.addEventListener("DOMContentLoaded", () => {
    const datePicker = document.getElementById('date-picker');
    const form = document.getElementById('logbook-form');

    // Set the default value of the date picker to today's date
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // Update the date display
    const dateElement = document.getElementById('current-date');
    const yearElement = document.getElementById('current-year');
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = new Date(today).toLocaleDateString(undefined, options);
    const year = new Date(today).getFullYear();

    if (dateElement && yearElement) {
        dateElement.textContent = formattedDate;
        yearElement.textContent = year;
    }

    // Handle date selection
    datePicker.addEventListener('change', () => {
        const selectedDate = datePicker.value;
        if (selectedDate) {
            loadEntries(selectedDate);
        }
    });

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
            loadEntries(today);  // Reload entries after submission
            form.reset();  // Optionally clear form fields after submission
            alert('Logbook entry added successfully!');  // Show success message
        })
        .catch(error => {
            console.error('Error submitting logbook form:', error);
            alert('Failed to submit logbook form. Please try again.');
        });
    });

    function loadEntries(date = today) {
        let url = '../php/logbook_entries.php';
        if (date) {
            url += `?date=${date}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Log fetched data to verify it includes the datetime
                
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
                        <td>${entry.datetime}</td>
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
                console.error('Error fetching logbook entries:', error);
                alert('Failed to load logbook entries. Please try again.');
            });
    }

    // Initial load of entries for today's date
    loadEntries(today);

    // Handle edit button click
    function handleEditClick(event) {
        const button = event.target;
        const row = button.closest("tr");
        const cells = row.querySelectorAll("td");

        cells.forEach((cell, index) => {
            if (index < cells.length - 1) {  // Exclude the last cell containing the edit button
                const input = document.createElement("input");
                input.type = "text";
                input.value = cell.textContent;
                cell.textContent = "";
                cell.appendChild(input);
            }
        });

        button.textContent = "Save";
        button.removeEventListener("click", handleEditClick);
        button.addEventListener("click", handleSaveClick);
    }

    function handleSaveClick(event) {
        const button = event.target;
        const row = button.closest("tr");
        const cells = row.querySelectorAll("td");
        const entryId = button.getAttribute("data-id");

        const updatedData = {};
        cells.forEach((cell, index) => {
            if (index < cells.length - 1) {  // Exclude the last cell containing the edit button
                const input = cell.querySelector("input");
                updatedData[index] = input.value;
                cell.textContent = input.value;
            }
        });

        // Assuming the order of columns matches the order of fields in the database
        const [staff, service, amount, commission, datetime] = Object.values(updatedData);

        fetch(`../php/update_logbook_entries.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: entryId, staff, service, amount, commission, datetime })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Update entry response:', data);
            button.textContent = "Edit";
            button.removeEventListener("click", handleSaveClick);
            button.addEventListener("click", handleEditClick);
            alert('Logbook entry updated successfully!');  // Show success message
        })
        .catch(error => {
            console.error('Error updating entry:', error);
            alert('Failed to update entry. Please try again.');
        });
    }
});
