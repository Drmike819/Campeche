import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { RegisterForm } from './components/authentication/RegisterForm';
import { LoginForm } from './components/authentication/LoginForm';
import { Nav } from './components/Nav';
function App() {
  return (
    <BrowserRouter>
      <main>
        <Nav/>

        <Routes>
          <Route path="register/" element={<RegisterForm/>} />
          <Route path='login/' element={<LoginForm/>}/>
        </Routes>
        
      </main>
    </BrowserRouter>
  );
}

export default App;

