import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './App.css';

function App() {
  // State variables
  const [info, setInfo] = useState({});
  const [input, setInput] = useState('');
  const [from, setFrom] = useState('usd');
  const [to, setTo] = useState('try'); // Corrected currency code "try"
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState('');

  // Fetch currency data from API
  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const response = await Axios.get(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`
        );
        setInfo(response.data[from]);
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    fetchCurrencyData();
  }, [from]);

  // Update available currency options when 'info' changes
  useEffect(() => {
    setOptions(Object.keys(info || {}));
  }, [info]);

  // Currency conversion function
  const convert = () => {
    if (!input || isNaN(input)) {
      setOutput('Please enter a valid number.');
      return;
    }
    const rate = info[to];
    if (rate) {
      setOutput(`${input} ${from.toUpperCase()} = ${(input * rate).toFixed(2)} ${to.toUpperCase()}`);
    } else {
      setOutput('Conversion failed');
    }
  };

  // Swap currency selection
  const flip = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="App">
      <h1>Currency Converter 💱</h1>
      <div className="container">
        {/* Input for amount */}
        <div className="left">
          <h3>Amount</h3>
          <input
            type="number"
            placeholder="Enter amount"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Dropdown for selecting the source currency */}
        <div className="middle">
          <h3>From</h3>
          <Dropdown options={options} onChange={(e) => setFrom(e.value)} value={from} />
        </div>

        {/* Button to swap currencies */}
        <div className="switch">
          <HiSwitchHorizontal size="30px" onClick={flip} />
        </div>

        {/* Dropdown for selecting the target currency */}
        <div className="right">
          <h3>To</h3>
          <Dropdown options={options} onChange={(e) => setTo(e.value)} value={to} />
        </div>
      </div>

      {/* Display conversion result */}
      <div className="result">
        <button onClick={convert}>Convert</button>
        <h2>Converted Amount:</h2>
        <p>{output}</p>
      </div>
    </div>
  );
}

export default App;
