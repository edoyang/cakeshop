document.addEventListener('DOMContentLoaded', function() {
    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('menu');
    var header = document.querySelector('header');

    hamburger.addEventListener('click', function(event) {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active'); // Toggle active class on hamburger as well
        event.stopPropagation();
    });

    document.addEventListener('click', function(event) {
        if (!header.contains(event.target)) {
            menu.classList.remove('active');
            hamburger.classList.remove('active'); // Ensure the hamburger goes back to default state
        }
    });
});
