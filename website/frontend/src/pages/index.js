import React, { useState, useEffect, useRef } from "react";
import { Container, AppBar, Box, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/AuthContext";
import Chart from 'react-apexcharts'

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [aboveThresh, setAboveThresh] = useState(false);
  const { isLoggedIn, setIsLoggedIn, login, logout, isPatient, setIsPatient, user, setUser } =
    useAuth();
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState("");
  const lastMessageTimeRef = useRef(Date.now());
  let bluetoothDevice;
  let characteristic;

  let incomingBuffer = '';

  function handleNotification(event) {

    lastMessageTimeRef.current = Date.now();
    setBluetoothDeviceName(bluetoothDevice.name); // TODO: maybe remove, this might trash performance, todo see
    // Convert the incoming DataView to a string
    const chunk = new TextDecoder().decode(event.target.value);
    //console.log(chunk);
    // Append the new chunk to the global buffer
    incomingBuffer += chunk;

    // Look for complete JSON objects in the buffer.
    // We assume each JSON object starts with '{' and ends with the matching '}'.
    let startIdx = incomingBuffer.indexOf('{');
    while (startIdx !== -1) {
      let openBraces = 0;
      let endIdx = -1;

      // Iterate from the first '{' to find the matching '}'
      for (let i = startIdx; i < incomingBuffer.length; i++) {
        if (incomingBuffer[i] === '{') {
          openBraces++;
        } else if (incomingBuffer[i] === '}') {
          openBraces--;
          // When all opened braces are closed, we've found a complete JSON object
          if (openBraces === 0) {
            endIdx = i;
            break;
          }
        }
      }

      // If no complete object is found, exit the loop and wait for more data.
      if (endIdx === -1) {
        break;
      }

      // Extract the complete JSON string
      const jsonString = incomingBuffer.slice(startIdx, endIdx + 1);
      try {
        const jsonObj = JSON.parse(jsonString);
        console.log("Received JSON object:", jsonObj);
        // Process jsonObj as needed...
        setAboveThresh(jsonObj.above_threshold);
        console.log(jsonObj.above_threshold);
        console.log(aboveThresh);
        addDataPoint({ x: Date.now(), y: jsonObj.smooth_jerk });
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

      // Remove the processed JSON data from the buffer
      incomingBuffer = incomingBuffer.slice(endIdx + 1);

      // Check if there's another JSON object starting in the remaining buffer
      startIdx = incomingBuffer.indexOf('{');
    }
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current;
      if (timeSinceLastMessage > 500) {
        setBluetoothDeviceName("");
      }
    }, 500);

    return () => clearInterval(timerInterval);
  }, []);

  const [chartData, setChartData] = useState({
    series: [{
      name: 'Total Value',
      data: []
    }],
    options: {
      chart: {
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        }
      },
      xaxis: {
        type: 'datetime'
      },
      title: { text: 'Dynamic Updating Chart', align: 'left' },
    },
  });

  // Function to add a new data point to the chart.
  // newPoint should be an object in the format: { x: timestamp, y: value }
  const addDataPoint = (newPoint) => {
    setChartData(prevState => ({
      ...prevState,
      series: [{
        ...prevState.series[0],
        data: [...prevState.series[0].data, newPoint]
      }]
    }));
  };

  const connectBluetooth = () => {
    // Example uses the Nordic UART Service (NUS).
    // Change the service/characteristic UUIDs as required for your device.
    const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const NUS_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // TX characteristic

    if (!navigator.bluetooth) {
      alert('Web Bluetooth is not supported in this browser.');
      return;
    }

    navigator.bluetooth.requestDevice({
      filters: [{ services: [NUS_SERVICE_UUID] }]
    })
      .then(device => {
        bluetoothDevice = device;
        console.log('Connecting to GATT Server...');
        return device.gatt.connect();
      })
      .then(server => {
        console.log('Getting Primary Service...');
        return server.getPrimaryService(NUS_SERVICE_UUID);
      })
      .then(service => {
        console.log('Getting Characteristic...');
        return service.getCharacteristic(NUS_CHARACTERISTIC_UUID);
      })
      .then(char => {
        characteristic = char;
        console.log('Starting Notifications...');
        return characteristic.startNotifications();
      })
      .then(() => {
        characteristic.addEventListener('characteristicvaluechanged', handleNotification);
        console.log('Notifications started. Listening for data...');
        setBluetoothDeviceName(bluetoothDevice.name);
        console.log(bluetoothDeviceName);
      })
      .catch(error => {
        console.error('Bluetooth Error: ', error);
      });

  }



  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <>
      <AppBar position="static">
        <Navbar />
      </AppBar>
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          style={{ width: "100%" }}
        >
          <Box
            style={{
              flex: 1, // Takes up 1/3 of the space
              maxWidth: "33%", // Ensure it doesn't exceed a third of the container's width
              padding: "1rem",
            }}
          >
            <Calendar
              onChange={handleDateChange}
              value={date}
              style={{
                width: "100%", // Fill width
                height: "100%", // Fill height
              }}
            />
          </Box>
          <Box
            style={{
              flex: 2, // Right section 2/3
              maxWidth: "66%",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "80vh", // Same height as left section
            }}
          >
            {
              /* Top Section (inside the right section) */
            }
            <Box
              style={{
                flex: 1, // Takes up part of the vertical space
                alignItems: "center",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",



                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: bluetoothDeviceName ? "flex-start" : "center",
                textAlign: "center",
              }}
            >
              {
                bluetoothDeviceName ?
                  <div>
                    <p style={{ color: aboveThresh ? "red" : "green", fontSize: "24pt", fontWeight: "bold" }}>
                      Patient Status: {aboveThresh ? "Bad" : "Good"}
                    </p>
                    <Button onClick={connectBluetooth}>{"Connected to " + (bluetoothDeviceName ? bluetoothDeviceName : "none")}</Button>
                    <Chart
                      options={chartData.options}
                      series={chartData.series}
                      type="line"
                      height="350"
                    />
                  </div>
                  :
                  <Button size="large" sx={{ fontSize: '20pt' }} onClick={connectBluetooth}>{"Please connect to the device"}</Button>
              }

            </Box>

            {/* Bottom Section (inside the right section) */}
            <Box
              style={{
                flex: 1, // Takes up part of the vertical space
                border: "1px solid #ccc",
                padding: "1rem",
              }}
            >

            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
