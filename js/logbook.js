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

    // Handle edit button click
    document.querySelectorAll("button.edit").forEach(button => {
        button.addEventListener("click", handleEditClick);
    });

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
        const row = button.closest("tr");
        const inputs = row.querySelectorAll("input");

        let isValid = true;
        inputs.forEach((input, index) => {
            const newText = input.value;
            const cell = input.closest("td");
            if ((index === 2 || index === 3) && !/^\d+$/.test(newText)) { // Validate Amount and Commission
                alert("Invalid input. Please enter a number for Amount and Commission.");
                isValid = false;
                return;
            }
            cell.innerHTML = newText;
        });

        if (isValid) {
            button.innerText = "Edit";
            button.classList.remove("save");
            button.classList.add("edit");

            button.removeEventListener('click', handleSaveClick);
            button.addEventListener('click', handleEditClick);

            updateTotals();
        }
    }

    function updateTotals() {
        const rows = document.querySelectorAll("tbody tr");
        let totalAmount = 0;
        let totalCommission = 0;

        rows.forEach(row => {
            const amount = parseInt(row.cells[2].innerText, 10);
            const commission = parseInt(row.cells[3].innerText, 10);

            totalAmount += amount;
            totalCommission += commission;
        });

        document.getElementById("total-amount").innerText = totalAmount;
        document.getElementById("total-commission").innerText = totalCommission;
    }

    // Initial calculation of totals
    updateTotals();
});
