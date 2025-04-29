import {BrowserRouter ,Routes,Route } from 'react-router-dom';

import About from './Pages/About';
import Signin from './Pages/Signin';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Header from './components/header';
import PrivateRoutes from './components/PrivateRoutes';

import ManagerSignUp from './Pages/ManagerComponent/ManagerSignUp';
import ManagerSignin from './Pages/ManagerComponent/ManagerSignin';
import AddEmployee from './Pages/AddEmployee';

import EmployeeProfile from './Pages/EmpoloyeeProfile';
import UpdateEmployee from './Pages/UpdateEmployee';
import EmployeeProfileAll from './Pages/EmployeeProfileAll';
import AddLeave from './Pages/AddLeave';
import LeaveProfile from './Pages/LeaveProfile';
import EmployeeDetails from './Pages/Home';
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import UpdateTransactions from "./components/Dashboard/UpdateTransactions.jsx";
import BalanceSheet from "./components/Pages/BalanceSheet.jsx";
import UpdateBalanceSheet from "./components/Pages/UpdateBalanceSheet.jsx";
import BankBook from "./components/Pages/BankBook.jsx";
import UpdateBankBook from "./components/Pages/UpdateBankBook.jsx";
import AddbankBook from "./components/Pages/AddbankBook.jsx";
import PettyCash from "./components/Pages/PettyCash.jsx";
import UpdatePettyCash from "./components/Pages/UpdatePettyCash.jsx";
import AddPettyCash from "./components/Pages/AddPettyCash.jsx";
import ProductManagement from "./components/routes/ProductManagement.jsx";





export default function App() {
  return <BrowserRouter>
<Header/>
  <Routes>
    <Route path="/" element={<EmployeeDetails/>}></Route>

    <Route path="/about" element={<About/>}></Route>
    <Route path="/sign-in" element={<Signin/>}></Route>
    <Route path="/additem" element={<AddEmployee/>}></Route>
    <Route path="/sign-up" element={<SignUp/>}></Route>
    <Route path="/admin_signup" element={<ManagerSignUp/>}></Route>
    <Route path="/admin_signin" element={<ManagerSignin/>}></Route>
    <Route path="/all-feedback" element={<EmployeeProfileAll/>}></Route>

    <Route path="/addleave" element={<AddLeave/>}></Route>

    
    <Route element={<PrivateRoutes/>}>
    <Route path="/profile" element={<Profile/>}></Route>
  
    <Route path="/leaveprofile" element={<LeaveProfile/>}></Route>

    <Route path="/employeeprofile" element={<EmployeeProfile/>}></Route>
    
    <Route path="/update-item/:id" element={<UpdateEmployee/>}></Route>

      {/*new routes for master branch*/}

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/update-transaction/:id" element={<UpdateTransactions />} />
      <Route path="/balancesheet" element={<BalanceSheet />} />
      <Route path="/update-balance/:id" element={<UpdateBalanceSheet />} />
      <Route path="/bankbook" element={<BankBook />} />
      <Route path="/update-bankbook/:id" element={<UpdateBankBook />} />
      <Route path="/add-bank-entry" element={<AddbankBook />} />
      <Route path="/pettycash" element={<PettyCash />} />
      <Route path="/update-pettycash/:id" element={<UpdatePettyCash />} />
      <Route path="/add-pettycash-entry" element={<AddPettyCash />} />

      <Route path="/product-management/*" element={<ProductManagement />}></Route>

    
    
    </Route>
 
    
  </Routes>
  
  </BrowserRouter>
  
}
