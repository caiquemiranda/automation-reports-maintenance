import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/novo-relatorio" element={<ReportForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 