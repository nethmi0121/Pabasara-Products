import "./App.css";
import { Routes, Route } from "react-router-dom"; // Removed BrowserRouter import here
import Home from "./component/home/home";
import AddProduct from "./component/addproduct/addProduct";
import ProductDetails from "./component/productDetails/productDetails";
import ManagerLogin from "./component/managerLogin/managerLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/manager-login" element={<ManagerLogin />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/add-product" element={<AddProduct />} />
    </Routes>
  );
}

export default App;