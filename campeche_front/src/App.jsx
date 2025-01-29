import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="register/" element={<RegisterForm/>} />
          <Route path='login/' element={<LoginForm/>}/>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

