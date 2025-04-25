import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const LogOut = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    const performLogout = async () => {
      await logout(); // Call your logout function to clear state and tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      navigate('/'); // Redirect to home or login page
    };

    // Perform logout on component mount (for manual logout)
    performLogout();

    // Perform logout on browser close
    const handleBeforeUnload = (event) => {
      event.preventDefault(); // Standard recommendation
      event.returnValue = ''; // For older browsers
      
      // Send logout request synchronously on close
      navigator.sendBeacon('/api/logout'); // Replace with your actual logout endpoint
    };

    // Attach the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [logout, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-semibold">You have successfully logged out.</h1>
    </div>
  );
};

export default LogOut;
