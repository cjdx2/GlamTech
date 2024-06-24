
// DATE
document.addEventListener("DOMContentLoaded", function() {
    // Get the current date in YYYY-MM-DD format
    let today = new Date().toISOString().split('T')[0];

    // Set the min attribute for the date input to the current date
    document.getElementById("date").setAttribute("min", today);
});
//DISABLED SERVICES
document.addEventListener('DOMContentLoaded', (event) => {
    const serviceOptions = document.querySelectorAll('option.servicesoption');
    serviceOptions.forEach(option => {
        option.disabled = true;
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const serviceOptions = document.querySelectorAll('option.service');
    serviceOptions.forEach(option => {
        option.disabled = true;
    });
});

//optionservices-none
document.addEventListener('DOMContentLoaded', (event) => {
    const serviceOptions = document.querySelectorAll('option.options');
    serviceOptions.forEach(option => {
        option.style.display = 'none';
    });
});



//TIME
function validateForm() {
    const hourInput = document.querySelector('input[name="appointmentHour"]');
    const minuteInput = document.querySelector('input[name="appointmentMinute"]');

    if (hourInput.value < 1 || hourInput.value > 12) {
        alert("Please enter a valid hour between 1 and 12.");
        return false;
    }

    if (minuteInput.value < 0 || minuteInput.value > 59) {
        alert("Please enter a valid minute between 00 and 59.");
        return false;
    }

    return true;
}

document.querySelector('input[name="appointmentHour"]').addEventListener('input', function () {
    if (this.value < 1) this.value = 1;
    if (this.value > 12) this.value = 12;
});

document.querySelector('input[name="appointmentMinute"]').addEventListener('input', function () {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

document.querySelector('input[name="appointmentHour"]').addEventListener('keydown', function (e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

document.querySelector('input[name="appointmentMinute"]').addEventListener('keydown', function (e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

//END