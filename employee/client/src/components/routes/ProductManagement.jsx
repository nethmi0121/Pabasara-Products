import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductManagementLayout from '../../ProductManagementLayout/ProductManagementLayout'



import RedirectComponent from './Redirect.jsx'
import Reports from "../../Pages/productManagement/Reports.jsx"
import Dashboard from "../../Pages/productManagement/Dashboard.jsx";
import Product from "../../Pages/productManagement/Product.jsx";
import Stock from "../../Pages/productManagement/Stock.jsx";
import Supplier from "../../Pages/productManagement/Supplier.jsx";
import Feedback from "../../Pages/productManagement/Feedback.jsx";


function ProductManagement() {
    return (
        <Routes>
            <Route element={<ProductManagementLayout />}>
                <Route index element={<RedirectComponent />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path="Products" element={<Product />} />
                <Route path="Stock" element={<Stock />} />
                <Route path="Supplier" element={<Supplier />} />
                <Route path="Feedback" element={<Feedback />} />
                <Route path="reports" element={<Reports />} />
            </Route>
        </Routes>
    )
}

export default ProductManagement