document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const usernameInput = document.getElementById('username');
        const username = usernameInput.value;

        // Redirect to the user-specific page with the provided username
        window.location.href = `http://localhost:5501/Dashboard/user.html?user=${username}`;
    });
});
