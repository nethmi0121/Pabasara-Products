import {BrowserRouter ,Routes,Route } from 'react-router-dom';

import About from './Pages/About';
import Signin from './Pages/Signin';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Header from './components/header';
import PrivateRoutes from './components/PrivateRoutes';


//import AllDetails from './Pages/FinancialHome';






import ManagerSignUp from './Pages/ManagerComponent/ManagerSignUp';
import ManagerSignin from './Pages/ManagerComponent/ManagerSignin';
import FeedbackProfileAll from './Pages/EmployeeProfileAll';
import AddEmployee from './Pages/AddEmployee';

import EmployeeProfile from './Pages/EmpoloyeeProfile';
import UpdateEmployee from './Pages/UpdateEmployee';
import EmployeeProfileAll from './Pages/EmployeeProfileAll';
import AddLeave from './Pages/AddLeave';
import LeaveProfile from './Pages/LeaveProfile';
import EmployeeDetails from './Pages/Home';




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

    
    
    </Route>
 
    
  </Routes>
  
  </BrowserRouter>
  
}
