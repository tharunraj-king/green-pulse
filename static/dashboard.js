// dashboard.js

// Import the functions
import { line_chart,multi_line } from './charts_creation.js';


// Button click action
document.getElementById('menuToggle').addEventListener('click', function () {
  document.getElementById('mainNav').classList.toggle('open');
});

// constantly used colors for charts
const COLORS = ['rgb(140, 214, 16)', 'rgb(239, 198, 0)', 'rgb(231, 24, 49)']
// Initialize empty arrays and dicts for line charts and gauge charts
let line_charts = []
let chartMetrics = ["cpu", "memory", "PacketsSent", "PacketsReceived", "disk"]
let gauge_charts = new Map();

let map = {
  "CPU Model": "cpuModel",
  "CPU RAM": "cpuRAM",
  "Hostname": "hostName",
  "IP": "ips",
  "System": "System",
  "No of CPU": "noOfCpus"
};

// Initialize line charts for CPU, Memory, Network Packets Sent, Network Packets Received, and Disk usage
line_charts.push(line_chart('cpuChart', 'CPU %', 'red', 'rgba(255, 0, 0, 0.1)'))
console.log(line_charts)

line_charts.push(line_chart('memoryChart', 'Memory %', 'blue', 'rgba(0, 195, 255, 0.1)'))
console.log(line_charts)

line_charts.push(line_chart('netPacketsSentChart', 'Packets sent', 'green', 'rgba(0, 255, 149, 0.1)'))
console.log(line_charts)

line_charts.push(line_chart('netPacketsReceivedChart', 'Packets received', 'yellow', 'rgba(251, 255, 0, 0.1)'))
console.log(line_charts)

line_charts.push(line_chart('diskChart', 'Disk usage', 'orange', 'rgba(255, 145, 0, 0.1)'))
console.log(line_charts)



// Function to update the value of an element by its ID
function update_value(elementID, value) {
  document.getElementById(elementID).innerText = (value);
}

// Function to update the flexboard with the given name and value
function update_flexboard(name, value) {
  //console.log(value)
  update_value((name + 'Value'), value);
}

// Function to check and update the maximum value
function check_max_value(name, value) {
  let maxValue = name + 'MaxValue';
  if (globalThis[maxValue] === undefined) {
    globalThis[maxValue] = 0;
  }
  if (globalThis[maxValue] >= +value) {
    return
  } else {
    console.log("setting max", value);
    //console.log(globalThis[maxValue],maxValue,(value+"12333"));
    globalThis[maxValue] = +value;
    //console.log("Looking for element with ID:", maxValue);
    update_value(maxValue, formatNumber(value));
    //console.log(document.getElementById(maxValue).innerText)
  }

}

// Function to check and update the minimum value
function check_min_value(name, value) {
  let minValue = name + 'MinValue';
  if (globalThis[minValue] === undefined) {
    globalThis[minValue] = 0;
  }
  if (globalThis[minValue] <= +value) {
    return
  } else {
    console.log("setting min", value);
    //console.log(globalThis[minValue],minValue,(value));
    globalThis[minValue] = +value;
    //console.log("Looking for element with ID:", minValue);
    update_value(minValue, formatNumber(value));
    //console.log(document.getElementById(minValue).innerText)
  }

}

// Function to determine the color based on percentage
function index(perc) {
  return perc < 50 ? 0 : perc < 90 ? 1 : 2;
}

// Function to create a gauge chart
function gauge_chart(variableName, display_value,) {
  var options = {
    type: 'doughnut',
    data: {
      labels: [`${display_value} % used`],
      datasets: [{
        label: '% used',
        data: [0, 100],
        backgroundColor: [COLORS[index(0)], "white"]
      }]
    },
    options: {
      rotation: 270, // start angle in degrees
      circumference: 180, // sweep angle in degrees
      cutout: '90%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const value = context.parsed;
              return index === 0
                ? `${display_value} Used: ${value}%`
                : `${display_value} Not Used: ${value}%`;
            }
          }
        },
        annotation: {
          annotations: [{
            type: 'doughnutLabel',
            content: ["%", `${display_value} Utilization`],
            position: 'center',
            font: {
              size: 18,
              weight: 'bold'
            },
            color: 'white'
          }
          ]
        }
      }
    }
  };
  globalThis[variableName] = new Chart(document.getElementById(variableName).getContext('2d'), options);
  gauge_charts.set(globalThis[variableName], display_value)

}

// Function to update the gauge chart with new values
function update_gauge(variableName, display_value, value) {
  // console.log(display_value.data.datasets[0]);
  console.log(variableName.data.datasets[0].data);
  variableName.data.datasets[0].data = [value, 100 - value];
  variableName.data.datasets[0].backgroundColor = [COLORS[index(value)], "white"];
  variableName.options.plugins.annotation.annotations[0].content = [(value + ' %'), `${display_value} Utilization`];
  variableName.update();
}

// The underscores in numbers (e.g., 1_000_000) are used for readability and have no effect on the value.
function formatNumber(num) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M"; // Convert to millions
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K"; // Convert to thousands
  } else {
    return num.toString(); // Return as is for smaller numbers
  }
}

// Function to update host details by fetching data from the api
function update_host_details() {
  fetch('/details')
    .then(res => res.json()) // Parse the JSON response
    .then(data => {
      console.log(data);
      Object.entries(map).forEach(([value, doc]) => {
        console.log(value, doc);
        document.getElementById(doc).innerText = `${value.replace("_", " ")}: ` + data[value];

      });
    })
    .catch(error => {
      console.error("Error updating host details:", error);
    });
}

gauge_chart("cpuGaugeChart", "CPU");
gauge_chart("memoryGaugeChart", "Memory");

// Call the function once
update_host_details();

// An asynchronous function to fetch metrics from the server
// and update the charts and flexboard
async function fetchMetrics() {
  const res = await fetch('/metrics');
  const data = await res.json();
  const time = new Date(data.timestamp * 1000).toLocaleTimeString();


  line_charts.forEach(chart => chart.data.labels.push(time));


  // Current value 
  try {
    chartMetrics.forEach(current_value => update_flexboard(current_value, formatNumber(data[current_value])));

  }
  catch (e) {
    console.log(e)
  }

  // Max value
  try {
    chartMetrics.forEach(current_value => check_max_value(current_value, data[current_value]));

  }
  catch (e) {
    console.log(e)
  }

  //Min value
  try {
    chartMetrics.forEach(current_value => check_min_value(current_value, data[current_value]));
  }
  catch (e) {
    console.log(e)
  }

  // Chart update

  cpuChart.data.datasets[0].data.push(data.cpu);
  // cpu_gauge.data.datasets[0].data = [data.cpu, 100 - data.cpu];
  // cpu_gauge.data.datasets[0].backgroundColor = [COLORS[index(data.cpu)], "white"];
  // cpu_gauge.options.plugins.annotation.annotations[0].content = [(data.cpu+' %'),"CPU Utilization"];
  // cpu_gauge.update();
  memoryChart.data.datasets[0].data.push(data.memory);
  netPacketsSentChart.data.datasets[0].data.push(data.PacketsSent);
  netPacketsReceivedChart.data.datasets[0].data.push(data.PacketsReceived);
  diskChart.data.datasets[0].data.push(data.disk);

  line_charts.forEach(chart => chart.update());

  gauge_charts.forEach((value, chart) => {
    console.log(`Updating gauge for ${value}`); // Debugging: Check if the function is being called
    if (data[value.toLowerCase()] !== undefined) { // Ensure the key exists
      update_gauge(chart, value, data[value.toLowerCase()]); // Call the update_gauge function
    } else {
      console.warn(`Key ${value.toLowerCase()} is missing in the data object`); // Log a warning if the key is missing
    }
  });
  line_charts.forEach(chart => {
    if (chart.data.labels.length > 30) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
  });
}

// Call the fetchMetrics function every 2 seconds to update the charts and flexboard
setInterval(fetchMetrics, 2000);
