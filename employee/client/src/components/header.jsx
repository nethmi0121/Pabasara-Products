import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css';

export default function Header() {
  const currentUser = useSelector((state) => state.user?.currentUser);

  return (
    <div className="nav"> 
      <div className='navbardetails'>
        <Link to='/'><h1 className='twebpagename'>Employee Management</h1></Link> 
   
        <ul className='other-topics'>
          <Link to='/'><li>Home</li></Link>  
          <Link to=''><li>About</li></Link>
          <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='Profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>  
        </ul>
      </div>   
    </div>
  );
}
