// src/App.js
import { useState, useEffect } from "react";
import abi from "./artifacts/contracts/Sc_Management.sol/Function_Frontend.json";


const ethers = require("ethers");
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [message, setMessage] = useState("");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      handleAccounts(accounts);
    }
  };

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      getContract(accounts[0]);
    } else {
      console.log("No account found");
    }
  };


  const getContract = async (account) => {
    // console.log(window.ethereum)
    const provider = new ethers.BrowserProvider(window.ethereum);

    // const provider = new ethers.providers.Web3Provider(window.ethereum)


    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", () => window.location.reload());

    await provider.send("eth_requestAccounts", []);
    if (provider) {
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(contractAddress, abi.abi, signer);
      setContract(contractInstance);
      loadContractData(contractInstance);
    }

  };

  const loadContractData = async (contractInstance) => {
  
    const message = await contractInstance.message();
    const counter = await contractInstance.counter();
    setMessage(message);
    console.log(message, counter)
    setCounter(counter);
  };

  const updateMessage = async () => {
    if (contract) {
      const newMessage = prompt("Enter new message:");
      const tx = await contract.appendToMessage(newMessage);
      await tx.wait();
      loadContractData(contract);
    }
  };

  const incrementCounter = async () => {
    if (contract) {
      const tx = await contract.incrementCounter();
      await tx.wait();
      loadContractData(contract);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Contract Interaction</h1>
        {!account && (
          <button onClick={getWallet}>Connect MetaMask</button>
        ) 
      }{
        !!account &&
          (
            <div>
              <p>Connected Account: {account}</p>
              <p>Message: {message}</p>
              <p>Counter: {counter.toString()}</p>
              <button onClick={updateMessage}>Update Message</button>
              <button onClick={incrementCounter}>Increment Counter</button>
            </div>
          )

        }
      </header>
    </div>
  );
}

export default App;