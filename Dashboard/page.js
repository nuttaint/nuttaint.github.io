const selLineDropdown = document.getElementById('selLine');
const selUserDropdown = document.getElementById('selUser'); // Assuming you also have a selUser dropdown

// Fetch currentPageNames from the server (replace with your actual fetch code)
async function fetchCurrentPageNames() {
    try {
        const response = await fetch('http://localhost:3000/pages'); // Update URL
        const currentPageNames = await response.json();
        return currentPageNames;
    } catch (error) {
        console.error('Error fetching currentPageNames:', error);
        return [];
    }
}

// Populate the dropdown options based on the fetched currentPageNames
async function populateDropdownOptions() {
    const currentPageNames = await fetchCurrentPageNames();

    // Clear any existing options
    selLineDropdown.innerHTML = '';

    // Add the initial placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '0';
    placeholderOption.textContent = '-Select Line-';
    selLineDropdown.appendChild(placeholderOption);

    // Mapping of page names to user-friendly names
    const displayNameMap = {
        'ipad_pro_11____3.html': 'left_to_right',
        'ipad_pro_11____4.html': 'right_to_left',
        'ipad_pro_11____7.html': 'top_to_bottom',
        'ipad_pro_11____8.html': 'bottom_to_top',
        'ipad_pro_11____11.html': 'lefttop_to_bottomright',
        'ipad_pro_11____12.html': 'rightbottom_to_lefttop',
        'ipad_pro_11____15.html': 'curve'
    };

    // Add the fetched currentPageNames as options
    currentPageNames.forEach((currentPageName) => {
        const option = document.createElement('option');
        option.value = currentPageName; // Use the actual page name
        option.textContent = displayNameMap[currentPageName];
        selLineDropdown.appendChild(option);
    });
}

// Event listener for when the user selects a page
selLineDropdown.addEventListener('change', () => {
    const selectedPageName = selLineDropdown.value;
    const selectedUser = selUserDropdown.value; // Get the selected user from selUser dropdown

    // Construct the URL with selected user and page name
    const newURL = `user.html?user=${encodeURIComponent(selectedUser)}&page=${encodeURIComponent(selectedPageName)}`;

    // Update the URL
    window.location.href = newURL;
});

// Call the function to populate dropdown options when the page loads
populateDropdownOptions();
