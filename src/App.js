import React, { useState } from "react";
import Cover from "./components/Cover";
import "./App.css";
import "./css/style.css";
import Foodiz from "./components/foodiz";
import { Container } from "react-bootstrap";
import { indexerClient, myAlgoConnect } from "./utils/constants";
import { Notification } from "./components/utils/Notifications";
import coverImg from "./assets/img/foodiz.jpg";

const App = function AppWrapper() {
  const [address, setAddress] = useState(null);
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(0);

  const fetchBalance = async (accountAddress) => {
    indexerClient
      .lookupAccountByID(accountAddress)
      .do()
      .then((response) => {
        const _balance = response.account.amount;
        setBalance(_balance);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const connectWallet = async () => {
    myAlgoConnect
      .connect()
      .then((accounts) => {
        const _account = accounts[0];
        setAddress(_account.address);
        setName(_account.name);
        fetchBalance(_account.address);
      })
      .catch((error) => {
        console.log("Could not connect to MyAlgo wallet");
        console.error(error);
      });
  };

  const disconnect = () => {
    setAddress(null);
    setName(null);
    setBalance(null);
  };

  return (
    <>
      <Notification />
      {address ? (
        <Container fluid className="main-nav">
          <Foodiz
            address={address}
            name={name}
            balance={balance}
            fetchBalance={fetchBalance}
            disconnect={disconnect}
          />
        </Container>
      ) : (
        <Cover
          name={"Foodiz Hub"}
          coverImg={coverImg}
          connect={connectWallet}
        />
      )}
    </>
  );
};

export default App;
