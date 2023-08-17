document.addEventListener('DOMContentLoaded', async function () {
  // Mapping between user-friendly page names and actual page names
  const pageNameMap = {
    'left_to_right': 'ipad_pro_11____3.html',
    'right_to_left': 'ipad_pro_11____4.html',
    'top_to_bottom': 'ipad_pro_11____7.html',
    'bottom_to_top': 'ipad_pro_11____8.html',
    'lefttop_to_bottomright': 'ipad_pro_11____11.html',
    'rightbottom_to_lefttop': 'ipad_pro_11____12.html',
    'curve': 'ipad_pro_11____15.html'
  };
  let i = 0;
  let index = 0;
  // Function to calculate average of an array
  // Initialize an object to store force data arrays for each page
  const forceDataArrays = {};
  const distanceIndexArray = {};
  // Initialize arrays to store AVG and SD values for each page
  const forceAvgArray = [];
  const forceSdArray = [];
  const maxTimeCounterArray = [];
  const maxTimeCounterByPage = {}
  // Define page URLs and corresponding indices
  const pageIndices = {
    'ipad_pro_11____3.html': 1,
    'ipad_pro_11____4.html': 2,
    'ipad_pro_11____7.html': 3,
    'ipad_pro_11____8.html': 4,
    'ipad_pro_11____11.html': 5,
    'ipad_pro_11____12.html': 6,
    'ipad_pro_11____15.html': 7,
  };



  // Fetch scatter data using the Fetch API
  async function fetchScatterData(user, page) {
    const actualPage = pageNameMap[page]; // Use pageNameMap directly without fallback

    console.log(`Fetching scatter data for user: ${user}, page: ${page}`);

    const response = await fetch(`http://localhost:3000/scatterdata?user=${user}&page=${page}`);
    const scatterData = await response.json();

    console.log('scatter:', scatterData);

    return scatterData;
  }

  // Function to calculate average of an array
  function calculateAverage(data) {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
  }

  // Function to calculate standard deviation of an array
  function calculateStandardDeviation(data) {
    const avg = calculateAverage(data);
    const squaredDiffs = data.map(value => Math.pow(value - avg, 2));
    const variance = calculateAverage(squaredDiffs);
    return Math.sqrt(variance);
  }
  // Calculate the index for distance data
  function calculateDistanceIndex(data) {
    const threshold = 5; // Adjust the threshold value as needed
    const validIndices = data.reduce((indices, value, index) => {
      if (value > threshold) {
        indices.push(index);
      }
      return indices;
    }, []);

    const totalIndices = data.length;
    return (validIndices.length / totalIndices) * 100;
  }
  function calculateMaxTimeCounter(scatterData, page) {
    const timeCounterData = scatterData[page].timeCounter;
    return Math.max(...timeCounterData).toFixed(2);
  }
  

  async function populateScatterGraph(user, page, canvasId, dataType) {
    try {
      const scatterData = await fetchScatterData(user, page);
      const data = scatterData[page][dataType]; // Use the data for the specified dataType
      const timeCounterData = scatterData[page].timeCounter;

      const scatterGraphCanvas = document.getElementById(canvasId);

      // Save force data into the forceDataArrays object
      if (dataType === 'force') {
        forceDataArrays[page] = data;

        // Calculate average and standard deviation
        const avg = calculateAverage(data);
        const sd = calculateStandardDeviation(data);
        const pageIndex = pageIndices[page];
        forceAvgArray[pageIndex] = (avg).toFixed(3);;
        forceSdArray[pageIndex] = (sd).toFixed(3);;
        console.log(`Page: ${page}, Force AVG: ${avg}, Force SD: ${sd}`);

        // Update the card inner HTML
        const card1 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelector('.card');
        const cardInner1 = card1.querySelector('.card-inner');
        cardInner1.innerHTML = `
        <h4>Force <br> <br>AVG = ${(avg).toFixed(3)}<br>SD = ${(sd).toFixed(3)}</h4>`;

      }
      else if (dataType === 'distance') {
        // Calculate and update distance-related information
        const distanceIndex = calculateDistanceIndex(data);
        const pageIndex = pageIndices[page];
        distanceIndexArray[pageIndex] = distanceIndex.toFixed(2); // Assuming you have a distanceIndexArray for each page

        const mainCardsContainer = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelector('.main-cards');
        const card2 = mainCardsContainer.querySelectorAll('.card')[1]; // Select the second card
        const cardInner2 = card2.querySelector('.card-inner');
        cardInner2.innerHTML = `
        <h4>Correct <br> <br>Percentage correct : ${distanceIndex.toFixed(2)}%</h4>`;

      }
      const pageIndex = pageIndices[page];
      const currentMaxTimeCounter = calculateMaxTimeCounter(scatterData, page);
      maxTimeCounterByPage[pageIndex] = currentMaxTimeCounter;
      const mainCardsContainer = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelector('.main-cards');
      const card3 = mainCardsContainer.querySelectorAll('.card')[2]; // Select the third card
      const cardInner3 = card3.querySelector('.card-inner');
      cardInner3.innerHTML = `
      <h4>Total time = ${currentMaxTimeCounter}s</h4>`;
      new Chart(scatterGraphCanvas, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: `${dataType === 'force' ? 'Force' : 'Distance'} vs. Time Counter (${user}) - Page: ${page}`,
              data: timeCounterData.map((value, index) => ({ x: value, y: data[index] })),
              backgroundColor: dataType === 'force' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(192, 75, 192, 0.5)',
              borderColor: dataType === 'force' ? 'rgba(75, 192, 192, 1)' : 'rgba(192, 75, 192, 1)',
              borderWidth: 1,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
            },
            y: {
              type: 'linear',
              position: 'left',
            },
          },
        },
      });
    } catch (error) {
      console.error('Error in populateScatterGraph:', error);
    }
  }

  function createTitleAndCards(page) {
    // Create the container for the title, line, and cards
    const container = document.createElement('div');
    container.classList.add('graph-container');

    // Create the line element
    const line = document.createElement('div');
    line.classList.add('line');

    // Create the title element
    const title = document.createElement('div');
    title.classList.add('title', 'left-aligned'); // Add 'left-aligned' class
    title.textContent = `StrightLine ${page.replace(/_/g, ' ')}`;

    // Create the first card with the first data pair
    const firstCard = document.createElement('div');
    firstCard.classList.add('card');
    const firstCardInner = document.createElement('div');
    firstCardInner.classList.add('card-inner');
    // Create the main cards container
    const mainCards = document.createElement('div');
    mainCards.classList.add('main-cards');

    // Create the first card with force average and standard deviation
    const card1 = document.createElement('div');
    card1.classList.add('card');
    const cardInner1 = document.createElement('div');
    cardInner1.classList.add('card-inner');
    const currentavgArray = forceAvgArray[index]; // Use index to access the correct data
    const currentsdArray = forceSdArray[index]; // Use index to access the correct data

    console.log(`Current AVG Array Value: ${currentavgArray}`);
    console.log(`Current SD Array Value: ${currentsdArray}`);

    cardInner1.innerHTML = `
     <h4>Force AVG = ${currentavgArray}<br>Force SD = ${currentsdArray}</h4>`;

    card1.appendChild(cardInner1);
    mainCards.appendChild(card1);


    const card2 = document.createElement('div');
    card2.classList.add('card');
    const cardInner2 = document.createElement('div');
    cardInner2.classList.add('card-inner');
    const currentDistanceIndex = distanceIndexArray[index]; // Use index to access the correct distance index

    console.log(`CurrentCorrect: ${currentDistanceIndex}`);

    cardInner2.innerHTML = `
       <h4>Correct  ${currentDistanceIndex}%</h4>`;
    console.log(`Percentage correct: ${currentDistanceIndex}%}`);


    const card3 = document.createElement('div');
    card3.classList.add('card');
    const cardInner3 = document.createElement('div');
    cardInner3.classList.add('card-inner');
    const currentMaxTimeCounter = maxTimeCounterByPage[index]; // Use index to access the correct data
    cardInner3.innerHTML = `
         <h4>Total time = ${currentMaxTimeCounter}s </h4>`;
    console.log(`Current Time Counter: ${currentMaxTimeCounter}}`);

    card1.appendChild(cardInner1);
    mainCards.appendChild(card1);
    card2.appendChild(cardInner2);
    mainCards.appendChild(card2);
    card3.appendChild(cardInner3);
    mainCards.appendChild(card3);

    // Append title and main cards to the container
    container.appendChild(line);
    container.appendChild(title);
    container.appendChild(mainCards);
    // Create the graph container
    const graphContainer = document.createElement('div');
    graphContainer.classList.add('graph-container');

    // Append the graph container to the main container
    container.appendChild(graphContainer);

    return container;
  }


  // Function to calculate average of an array
  function calculateAverage(data) {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
  }

  // Function to calculate standard deviation of an array
  function calculateStandardDeviation(data) {
    const avg = calculateAverage(data);
    const squaredDiffs = data.map(value => Math.pow(value - avg, 2));
    const variance = calculateAverage(squaredDiffs);
    return Math.sqrt(variance);
  }
  // ...

  async function populateAllGraphs() {
    const scatterGraphContainer = document.querySelector('.charts');

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const selectedUser = urlParams.get('user');

      const graphAndCardContainer = document.createElement('div');
      graphAndCardContainer.classList.add('graph-and-card-container');
      let count = 0;

      for (const userFriendlyPage in pageNameMap) {
        while (count >= 7 && forceAvgArray[1] == '') {
          break;
        }

        const actualPage = pageNameMap[userFriendlyPage];
        const canvasIdForce = `scatterGraph_${selectedUser}_${userFriendlyPage}_force`;
        const canvasIdDistance = `scatterGraph_${selectedUser}_${userFriendlyPage}_distance`;

        const graphElementForce = document.createElement('canvas');
        graphElementForce.id = canvasIdForce;
        graphElementForce.width = 400;
        graphElementForce.height = 300;
        graphElementForce.classList.add('force-graph');

        const graphElementDistance = document.createElement('canvas');
        graphElementDistance.id = canvasIdDistance;
        graphElementDistance.width = 400;
        graphElementDistance.height = 300;
        graphElementDistance.classList.add('distance-graph');

        const chartsCard = document.createElement('div');
        chartsCard.classList.add('charts-card');
        chartsCard.appendChild(graphElementForce);
        chartsCard.appendChild(graphElementDistance);

        const graphContainer = createTitleAndCards(userFriendlyPage);
        graphContainer.appendChild(chartsCard);

        graphAndCardContainer.appendChild(graphContainer);

        // Plot the force chart
        populateScatterGraph(selectedUser, actualPage, canvasIdForce, 'force');

        // Plot the distance chart
        populateScatterGraph(selectedUser, actualPage, canvasIdDistance, 'distance');

        count++;
      }

      scatterGraphContainer.appendChild(graphAndCardContainer);
    } catch (error) {
      console.error('Error in populateAllGraphs:', error);
    }
  }
  populateAllGraphs();
});
