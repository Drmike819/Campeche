import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { RegisterForm } from './components/authentication/RegisterForm';
import { LoginForm } from './components/authentication/LoginForm';
import { Nav } from './components/Nav';
import { ProductForm } from './components/products/formProducts';
import { ListProducts } from './components/products/ListProducts';
import { DetalleProduct } from './components/products/DetalleProduct';
import { ProductsInCategories } from './components/products/ProductsInCategories';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main>
          <Nav/>

          <Routes>
            <Route path="register/" element={<RegisterForm/>} />
            <Route path='login/' element={<LoginForm/>}/>
            <Route path='newProduct/' element={<ProductForm/>}/>
            <Route path='products/' element={<ListProducts/>}/>
            <Route path='DetailProduct/:productId/' element={<DetalleProduct/>}/>
            <Route path='/' element={<ProductsInCategories/>}/>
          </Routes>
          
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

