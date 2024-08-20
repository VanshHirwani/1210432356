import React, { useState } from 'react';
import axios from 'axios';

const WINDOW_SIZE = 10;

function App() {
  const [numberType, setNumberType] = useState('p');
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [average, setAverage] = useState(0);

  const fetchNumber = async () => {
    try {
      const response = await axios.get(http://localhost:5000/numbers/${numberType}, { timeout: 500 });

      if (response.status === 200) {
        const fetchedNumbers = response.data.numbers;
        
        // Avoid duplicates
        const uniqueNumbers = fetchedNumbers.filter(num => !windowCurrState.includes(num));
        
        if (uniqueNumbers.length > 0) {
          const newWindow = [...windowCurrState, ...uniqueNumbers];

          // Maintain the window size
          if (newWindow.length > WINDOW_SIZE) {
            const excess = newWindow.length - WINDOW_SIZE;
            setWindowPrevState(newWindow.slice(0, excess));
            setWindowCurrState(newWindow.slice(excess));
          } else {
            setWindowPrevState(windowCurrState);
            setWindowCurrState(newWindow);
          }

          // Update numbers and average
          setNumbers(fetchedNumbers);
          const avg = newWindow.reduce((a, b) => a + b, 0) / newWindow.length;
          setAverage(avg.toFixed(2));
        }
      }
    } catch (error) {
      console.error('Error fetching number:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Average Calculator</h1>
      
      <div style={styles.form}>
        <label htmlFor="numberType">Select Number Type:</label>
        <select
          id="numberType"
          value={numberType}
          onChange={(e) => setNumberType(e.target.value)}
          style={styles.select}
        >
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="e">Even</option>
          <option value="r">Random</option>
        </select>
        <button onClick={fetchNumber} style={styles.button}>Fetch Number</button>
      </div>

      <div style={styles.results}>
        <h3>Window Previous State:</h3>
        <p>{windowPrevState.join(', ') || 'None'}</p>

        <h3>Window Current State:</h3>
        <p>{windowCurrState.join(', ') || 'None'}</p>

        <h3>Numbers Received:</h3>
        <p>{numbers.join(', ') || 'None'}</p>

        <h3>Average:</h3>
        <p>{average || 0}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    marginBottom: '20px'
  },
  select: {
    marginLeft: '10px',
    padding: '5px'
  },
  button: {
    marginLeft: '10px',
    padding: '5px 10px',
    cursor: 'pointer'
  },
  results: {
    textAlign: 'left',
    marginTop: '20px'
  }
};

export default App;
