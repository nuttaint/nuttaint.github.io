document.addEventListener('DOMContentLoaded', async function () {
    const sidebarList = document.querySelector('.sidebar-list');
  
    // Fetch user data from the backend API
    try {
      const response = await fetch('http://localhost:3000/users');
      const userData = await response.json();
  
      // Populate the sidebar with user links
      userData.forEach(user => {
        const listItem = document.createElement('li');
        listItem.classList.add('sidebar-list-item');
  
        const link = document.createElement('a');
        link.href = `http://localhost:5501/Dashboard/user.html?user=${user}`;
  
        const span = document.createElement('span');
        const username = document.createTextNode(user);
  
        link.appendChild(span);
        link.appendChild(username);
        listItem.appendChild(link);
  
        sidebarList.appendChild(listItem);
  
        link.addEventListener('click', event => {
          event.preventDefault();
          // Navigate to the user's page
          window.location.href = link.href;
        });
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  });
  