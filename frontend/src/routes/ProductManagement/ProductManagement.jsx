import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProductManagementLayout from '../../ProductManagementLayout/ProductManagementLayout'
import Dashboard from '../../pages/productManagement/Dashboard'
import Product from '../../pages/productManagement/Product'
import Stock from '../../pages/productManagement/Stock'
import Feedback from '../../pages/productManagement/Feedback'
import Supplier from '../../pages/productManagement/Supplier'
import RedirectComponent from './Redirect'
import Reports from '../../pages/productManagement/Reports'


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