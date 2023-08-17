
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
let zeroCount = 0; // Declare zeroCount as a global variable
const forceZeroMoreThanTwice = '';

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

document.addEventListener('DOMContentLoaded', async function () {
  const forceZero = Array.from({ length: Object.keys(pageIndices).length }, () => false);
  function checkSameValue(dataArray) {
    const valueCount = {};
    for (const value of dataArray) {
      valueCount[value] = (valueCount[value] || 0) + 1;
      if (valueCount[value] >= 5) {
        return true;
      }
    }
    return false;
  }

  function checkValuesInRange(dataArray, range1, range2) {
    const firstValueInRange = dataArray[0] >= range1[0] && dataArray[0] <= range1[1];
    const lastValueInRange = dataArray[dataArray.length - 1] >= range2[0] && dataArray[dataArray.length - 1] <= range2[1];

    return { firstValueInRange, lastValueInRange };
  }

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

  function calculateZeroCount(dataArray) {
    return dataArray.filter(forceValue => forceValue === 0).length;
  }
  async function populateScatterGraph(user, page, canvasId, dataType) {
    try {
      const scatterData = await fetchScatterData(user, page);
      const data = scatterData[page][dataType]; // Use the data for the specified dataType
      const timeCounterData = scatterData[page].timeCounter;
      const xData = scatterData[page].x;
      const yData = scatterData[page].y;
      const forcecheck =  scatterData[page].force;
      const scatterGraphCanvas = document.getElementById(canvasId);
      // Case 1: Check for same value condition
      const sameXValue = checkSameValue(xData);
      const sameYValue = checkSameValue(yData);
      const zeroCount = calculateZeroCount(forcecheck);
      if (sameXValue && sameYValue) {
        const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
        cardInner4.innerHTML = `
        <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
          Error <br> <br>ลากเส้นซ้ำ<br>
        </h4>`;
      }
     
    if (zeroCount > 1) {
      const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
      cardInner4.innerHTML = `
      <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
        Error <br> <br>ยกปากกา<br>
      </h4>`;
    }

      if (page === 'ipad_pro_11____3.html') {
        const xValueRanges = [[699, 709], [2345, 2360]];
        const { firstValueInRange: xFirstValueInRange, lastValueInRange: xLastValueInRange } = checkValuesInRange(xData, ...xValueRanges);
        const yValueRanges = [[1117, 1127], [1117, 1127]];
        const { firstValueInRange: yFirstValueInRange, lastValueInRange: yLastValueInRange } = checkValuesInRange(yData, ...yValueRanges);


        console.log('xFirstValueInRange:', xFirstValueInRange);
        console.log('xLastValueInRange:', xLastValueInRange);

        if (!xFirstValueInRange && !xLastValueInRange && !yFirstValueInRange && !yLastValueInRange) {
          const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
          cardInner4.innerHTML = `
          <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
            Error <br> <br>ลากเส้นเกินจุดอ้างอิง<br>
          </h4>`;
        }
      }
      else if (page === 'ipad_pro_11____4.html') {
        const xValueRanges = [[2313, 2323], [667, 677]];
        const { firstValueInRange: xFirstValueInRange, lastValueInRange: xLastValueInRange } = checkValuesInRange(xData, ...xValueRanges);
        const yValueRanges = [[1117, 1127], [1117, 1127]];
        const { firstValueInRange: yFirstValueInRange, lastValueInRange: yLastValueInRange } = checkValuesInRange(yData, ...yValueRanges);
        console.log('xFirstValueInRange:', xFirstValueInRange);
        console.log('xLastValueInRange:', xLastValueInRange);

        if (!xFirstValueInRange && !xLastValueInRange && !yFirstValueInRange && !yLastValueInRange) {
          const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
          cardInner4.innerHTML = `
          <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
            Error <br> <br>ลากเส้นเกินจุดอ้างอิง<br>
          </h4>`;
        }
      }
      else if (page === 'ipad_pro_11____7.html') {
        const xValueRanges = [[895, 905], [2069, 2079]];
        const { firstValueInRange: xFirstValueInRange, lastValueInRange: xLastValueInRange } = checkValuesInRange(xData, ...xValueRanges);
        const yValueRanges = [[1271, 1281], [957, 967]];
        const { firstValueInRange: yFirstValueInRange, lastValueInRange: yLastValueInRange } = checkValuesInRange(yData, ...yValueRanges);
        console.log('xFirstValueInRange:', xFirstValueInRange);
        console.log('xLastValueInRange:', xLastValueInRange);

        if (!xFirstValueInRange && !xLastValueInRange && !yFirstValueInRange && !yLastValueInRange) {
          const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
          cardInner4.innerHTML = `
          <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
            Error <br> <br>ลากเส้นเกินจุดอ้างอิง<br>
          </h4>`;
        }
      }
      else if (page === 'ipad_pro_11____8.html') {
        const xValueRanges = [[895, 905], [2069, 2079]];
        const { firstValueInRange: xFirstValueInRange, lastValueInRange: xLastValueInRange } = checkValuesInRange(xData, ...xValueRanges);
        const yValueRanges = [[959, 969], [1269, 1279]];
        const { firstValueInRange: yFirstValueInRange, lastValueInRange: yLastValueInRange } = checkValuesInRange(yData, ...yValueRanges);
        console.log('xFirstValueInRange:', xFirstValueInRange);
        console.log('xLastValueInRange:', xLastValueInRange);

        if (!xFirstValueInRange && !xLastValueInRange && !yFirstValueInRange && !yLastValueInRange) {
          const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
          cardInner4.innerHTML = `
          <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
            Error <br> <br>ลากเส้นเกินจุดอ้างอิง<br>
          </h4>`;
        }
      }
      else if (page === 'ipad_pro_11____11.html') {
        const xValueRanges = [[835, 840], [2121, 2131]];
        const { firstValueInRange: xFirstValueInRange, lastValueInRange: xLastValueInRange } = checkValuesInRange(xData, ...xValueRanges);
        const yValueRanges = [[965, 975], [1225, 1235]];
        const { firstValueInRange: yFirstValueInRange, lastValueInRange: yLastValueInRange } = checkValuesInRange(yData, ...yValueRanges);
        console.log('xFirstValueInRange:', xFirstValueInRange);
        console.log('xLastValueInRange:', xLastValueInRange);

        if (!xFirstValueInRange && !xLastValueInRange && !yFirstValueInRange && !yLastValueInRange) {
          const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
          cardInner4.innerHTML = `
          <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
            Error <br> <br>ลากเส้นเกินจุดอ้างอิง<br>
          </h4>`;
        }
      }
      else if (page === 'ipad_pro_11____12.html') {
        const xValueRanges = [[1073, 1083], [1879, 1889]];
        const { firstValueInRange: xFirstValueInRange, lastValueInRange: xLastValueInRange } = checkValuesInRange(xData, ...xValueRanges);
        const yValueRanges = [[1225, 125], [961, 971]];
        const { firstValueInRange: yFirstValueInRange, lastValueInRange: yLastValueInRange } = checkValuesInRange(yData, ...yValueRanges);
        console.log('xFirstValueInRange:', xFirstValueInRange);
        console.log('xLastValueInRange:', xLastValueInRange);

        if (!xFirstValueInRange && !xLastValueInRange && !yFirstValueInRange && !yLastValueInRange) {
          const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
          cardInner4.innerHTML = `
          <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
            Error <br> <br>ลากเส้นเกินจุดอ้างอิง<br>
          </h4>`;
        }
      }
      else if (page === 'ipad_pro_11____15.html') {
        const xValueRanges = [[713, 723], [2347, 2357]];
        const { firstValueInRange: xFirstValueInRange, lastValueInRange: xLastValueInRange } = checkValuesInRange(xData, ...xValueRanges);
        const yValueRanges = [[1187, 1197], [1995, 1205]];
        const { firstValueInRange: yFirstValueInRange, lastValueInRange: yLastValueInRange } = checkValuesInRange(yData, ...yValueRanges);
        console.log('xFirstValueInRange:', xFirstValueInRange);
        console.log('xLastValueInRange:', xLastValueInRange);

        if (!xFirstValueInRange && !xLastValueInRange && !yFirstValueInRange && !yLastValueInRange) {
          const cardInner4 = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelectorAll('.card')[3];
          cardInner4.innerHTML = `
          <h4 style="font-family: 'Montserrat', sans-serif; font-weight: bold; color: white;">
            Error <br> <br>ลากเส้นเกินจุดอ้างอิง<br>
          </h4>`;
        }
      }

      // Initialize the forceZero array
      // Save force data into the forceDataArrays object
      if (dataType === 'force') {
        forceDataArrays[page] = data;
        const avg = calculateAverage(data);
        const sd = calculateStandardDeviation(data);
        const pageIndex = pageIndices[page];
        forceAvgArray[pageIndex] = (avg).toFixed(3);
        forceSdArray[pageIndex] = (sd).toFixed(3);

        // Update the card inner HTML for Force information
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
        <h4>Correct <br> <br>Percentage : ${distanceIndex.toFixed(2)}%</h4>`;
        createDonutChart(user, page, distanceIndex, canvasId);
      }

      const pageIndex = pageIndices[page];
      const currentMaxTimeCounter = calculateMaxTimeCounter(scatterData, page);
      maxTimeCounterByPage[pageIndex] = currentMaxTimeCounter;
      const mainCardsContainer = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelector('.main-cards');
      const card3 = mainCardsContainer.querySelectorAll('.card')[2]; // Select the third card
      const cardInner3 = card3.querySelector('.card-inner');
      cardInner3.innerHTML = `
      <h4>Time <br> <br>Total time: ${currentMaxTimeCounter}s</h4>`;
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
  function createDonutChart(user, page, distanceIndex, canvasId) {
    const pieCanvasId = `donutChart_${user}_${page}`;
    const pieCanvas = document.createElement('canvas');

    // Set custom width and height for the donut chart canvas
    const donutChartWidth = 220; // Set your desired width
    const donutChartHeight = 220; // Set your desired height

    pieCanvas.id = pieCanvasId;
    pieCanvas.width = donutChartWidth;
    pieCanvas.height = donutChartHeight;

    const pieChartContainer = document.createElement('div');
    pieChartContainer.classList.add('pie-chart-container'); // Add class here
    pieChartContainer.appendChild(pieCanvas);

    // Set the --p CSS variable based on the distanceIndex
    pieCanvas.style.setProperty('--p', distanceIndex);

    // Create a div for the chart name
    const chartNameContainer = document.createElement('div');
    chartNameContainer.classList.add('chart-name');
    chartNameContainer.textContent = `Correct : ${(distanceIndex).toFixed(1)}%`; // Set the chart name text
    pieChartContainer.appendChild(chartNameContainer);

    const mainCardsContainer = document.querySelector(`#${canvasId}`).closest('.graph-container').querySelector('.charts-card');
    mainCardsContainer.appendChild(pieChartContainer);

    const pieContext = pieCanvas.getContext('2d');
    new Chart(pieContext, {
      type: 'doughnut', // Use 'doughnut' type for a donut-like pie chart
      data: {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
          data: [distanceIndex, 100 - distanceIndex],
          backgroundColor: ['rgba(144, 238, 144, 0.8)', 'rgba(255, 255, 255, 0.8)'], // Customize the colors here
          borderColor: 'rgba(169, 169, 169, 0.8)', // Use gray color for the border
          borderWidth: 1, // Adjust the border width
          hoverOffset: 4, // Adjust the hover offset for a better visual effect
        }],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataValue = context.parsed;
                return dataValue.toFixed(2) + '%'; // Display the percentage with two decimal places
              },
            },
          },
        },
        // cutout: '50%', // Adjust the cutout value for the donut hole size
        center: {
          display: true,
          text: '', // Display the percentage inside the center of the donut
          fontStyle: 'bold', // Customize the font style
          fontSize: 24, // Customize the font size
          color: 'black', // Customize the font color
        },
      },
    });

    // Add the animate class to trigger the animation
    pieCanvas.classList.add('animate');
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

    const card4 = document.createElement('div');
    card4.classList.add('card');
    const cardInner4 = document.createElement('div');
    cardInner4.classList.add('card-inner');
    cardInner4.innerHTML = forceZeroMoreThanTwice
      ? `<h4>Error</h4>`
      : `none`;

    card1.appendChild(cardInner1);
    mainCards.appendChild(card1);
    card2.appendChild(cardInner2);
    mainCards.appendChild(card2);
    card3.appendChild(cardInner3);
    mainCards.appendChild(card3);
    card4.appendChild(cardInner4);
    mainCards.appendChild(card4);

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
      if (hasUserAndPageParameter()) {
        populateSelectedGraph(); // Populate selected user and page data
      } else {
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

          populateScatterGraph(selectedUser, actualPage, canvasIdForce, 'force');

          // Plot the distance chart and pie chart
          populateScatterGraph(selectedUser, actualPage, canvasIdDistance, 'distance');

          count++;
        }

        scatterGraphContainer.appendChild(graphAndCardContainer);
      }
    } catch (error) {
      console.error('Error in populateAllGraphs:', error);
    }
  }



  function hasUserAndPageParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('user') && urlParams.has('page');
  }

  async function populateSelectedGraph() {
    if (hasUserAndPageParameter()) {
      const urlParams = new URLSearchParams(window.location.search);
      const selectedUser = urlParams.get('user');
      const selectedPage = urlParams.get('page');
      const userFriendlyPage = selectedPage.replace(/_/g, ' ');
      const actualPage = pageNameMap[selectedPage];
      const canvasIdForce = `scatterGraph_${selectedUser}_${selectedPage}_force`;
      const canvasIdDistance = `scatterGraph_${selectedUser}_${selectedPage}_distance`;

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

      const scatterGraphContainer = document.querySelector('.charts');
      scatterGraphContainer.appendChild(graphContainer);

      populateScatterGraph(selectedUser, actualPage, canvasIdForce, 'force');
      populateScatterGraph(selectedUser, actualPage, canvasIdDistance, 'distance');
    }
  }

  // Call the function to populate the selected graph if URL parameters are present
  populateAllGraphs();
});
