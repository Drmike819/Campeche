import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { RegisterForm } from './components/RegisterForm';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<RegisterForm/>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

