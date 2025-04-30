import React from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ServiceOrderInfo from './components/ServiceOrderInfo/ServiceOrderInfo';
import ServiceDetails from './components/ServiceDetails/ServiceDetails';
import Conclusion from './components/Conclusion/Conclusion';
import TechnicianInfo from './components/TechnicianInfo/TechnicianInfo';
import './App.css';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="content-with-sidebar">
        <Header />
        <main className="main-content">
          <ServiceOrderInfo />
          <ServiceDetails />
          <Conclusion />
          <TechnicianInfo />
        </main>
      </div>
    </div>
  );
}

export default App;
