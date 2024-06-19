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

