async function populateDropdown() {
    try {
        const response = await fetch('http://localhost:3000/users'); // Adjust the URL
        const users = await response.json();

        const selectElement = document.getElementById('selUser');

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            selectElement.appendChild(option);
        });

        // Event listener for dropdown change
        selectElement.addEventListener('change', async function() {
            const selectedUser = selectElement.value;
            userDisplayDiv.textContent = selectedUser === '0' ? '-Select User-' : selectedUser;
            
            if (selectedUser !== '0') {
                
                // Redirect to the user-specific page with the selected user as a query parameter
                window.location.href = `user.html?user=${encodeURIComponent(selectedUser)}`;
            }
        });
        

    } catch (error) {
        console.error('Error:', error);
    }
}

populateDropdown();
