import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { RegisterForm } from './components/authentication/RegisterForm';
import { LoginForm } from './components/authentication/LoginForm';
import { Nav } from './components/Nav';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main>
          <Nav/>

          <Routes>
            <Route path="register/" element={<RegisterForm/>} />
            <Route path='login/' element={<LoginForm/>}/>
          </Routes>
          
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

