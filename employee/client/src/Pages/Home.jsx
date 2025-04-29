import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/EmployeeDetails.css';

export default function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterData(e.target.value);
  };

  const filterData = (query) => {
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  return (
    <div className="employee-home">
      <br></br>
      {/* Hero Section */}
      <div className="hero">
        <h1>Employee Details and Leave Form</h1>
        <p>Manage employee records, check leave history, and update leave status.</p>
        <button className="cta-button">
          <Link to="/addleave">Add Leave</Link>
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for employees"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Employee List Section */}
      <div className="items-list">
        {filteredEmployees.map((employee) => (
          <div className="item-card" key={employee.id}>
            <img src={employee.profilePicture} alt={employee.name} />
            <h3>{employee.name}</h3>
            <p>Department: {employee.department}</p>
            <p>Position: {employee.position}</p>
            <p>Leave Balance: {employee.leaveBalance} days</p>

            {/* View Details Button */}
            <Link to={`/employee/${employee.id}`} className="view-details">
              View Details & Leave History
            </Link>
          </div>
        ))}
      </div>

      {/* Call-to-Action Section */}
      <div className="cta-section">
        <h2>Manage Employee Leaves Efficiently</h2>
        <p>Ensure smooth HR operations by keeping track of employee leave records.</p>
        <button className="cta-button">
          <Link to="/sign-up">Sign Up</Link>
        </button>
      </div>
    </div>
  );
}
