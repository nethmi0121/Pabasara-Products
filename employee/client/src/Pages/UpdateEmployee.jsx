import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/updateitem.css';
import { app } from '../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

export default function  UpdateEmployee() {
  const [, setImagePercent] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);

  const [image1] = useState(undefined);
  const [image2, setImage2] = useState(undefined);
  const [updatediscount, setupdatediscount] = useState({
    emp_id: "",
    name: "",
    position: "",
    p_no: "",
    u_email:"",
    address: "",
    statues:"",
    
    salary: "",
    allowances: "",
    deductions: "",
    bankAccount: "",
    bankName: "",
    bankBranch: "",// Add a field to store the star rating value
    
  });

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  useEffect(() => {
    if (image2) {
      handleFileUpload(image2, 'alternateProfilePicture');
    }
  }, [image2]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        console.error('Image upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setupdatediscount((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    if (fileRef1.current) {
      fileRef1.current.click();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/getitem/${id}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
          setupdatediscount(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    setupdatediscount({
      ...updatediscount,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/user/updateitem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount._id,
          ...updatediscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Updated successfully");
        navigate('/employeeprofile');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  // Add a field to store the star rating value
  return (
    <div className="service-update">
      
      <input
        type="text"
        id="emp_id"
        name="emp_id"
        onChange={handleInputChange}
        value={updatediscount?.emp_id}
      />


       
       <input
        type="text"
        id="name"
        name="name"
        onChange={handleInputChange}
        value={updatediscount?.name}
      />
       
 
       <input
        type="text"
        id="u_email"
        name="u_email"
        onChange={handleInputChange}
        value={updatediscount?.u_email}
      />
       
       <input
        type="text"
        id="position"
        name="position"
        onChange={handleInputChange}
        value={updatediscount?.position}
      />
       
       <input
        type="text"
        id="p_no"
        name="p_no"
        onChange={handleInputChange}
        value={updatediscount?.p_no}
      />
       
       <input
        type="text"
        id="address"
        name="address"
        onChange={handleInputChange}
        value={updatediscount?.address}
      />
       
       <input
        type="text"
        id="statues"
        name="statues"
        onChange={handleInputChange}
        value={updatediscount?.statues}
      />
       
   
       <input
        type="text"
        id="salary"
        name="salary"
        onChange={handleInputChange}
        value={updatediscount?.salary}
      />
       


       <input
        type="text"
        id="allowances"
        name="allowances"
        onChange={handleInputChange}
        value={updatediscount?.allowances}
      />
       
       <input
        type="text"
        id="deductions"
        name="deductions"
        onChange={handleInputChange}
        value={updatediscount?.deductions}
      />
       
       <input
        type="text"
        id="bankAccount"
        name="bankAccount"
        onChange={handleInputChange}
        value={updatediscount?.bankAccount}
      />
       
     
     

       <input
        type="text"
        id="bankName"
        name="bankName"
        onChange={handleInputChange}
        value={updatediscount?.bankName}
      />
       
       <input
        type="text"
        id="bankBranch"
        name="bankBranch"
        onChange={handleInputChange}
        value={updatediscount?.bankBranch}
      />
       
      <button className="update-btn" onClick={handleUpdate}>
        Update 
      </button>
      <br />
      <br />
    </div>
  );
}

