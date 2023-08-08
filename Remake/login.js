localStorage.setItem('myKey', 'myValue');// login.js

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("login");

    loginButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const usernameInput = document.getElementById("username");
        const username = usernameInput.value;

        if (username) {
            localStorage.setItem("username", username);
            window.location.href = "ipad_pro_11____2.html"; // Redirect to the desired page
        } else {
            alert("Please enter a username.");
        }
    });
});
