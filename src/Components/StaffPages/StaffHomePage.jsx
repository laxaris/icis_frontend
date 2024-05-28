import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import iytelogo from "../Assets/iytelogo.png";
import './Staff.css';
import '../PopUp.css';

const StaffHomePage = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [name, setName] = useState('');
    
    const handleLogout = () => {
        Cookies.remove('jwtToken');
        navigate('/login');
    };

    const handleClick = (path) => {
        navigate(path);
    };

    const formatName = (name) => {
        return name
            .split('.') 
            .map(part => part.charAt(0).toUpperCase() + part.slice(1)) 
            .join(' '); 
    };

    const checkAuthentication = async () => {
        const token = Cookies.get('jwtToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const username = 'user';
    const password = 'a5836267-68d8-48f2-b10e-61f5ac65b44b'; // Replace this with the actual generated password
    const credentials = btoa(`${username}:${password}`);

const response = await axios.post('https://icis-production.up.railway.app/api/checktoken', {}, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const { usertype, name } = response.data;

            if (response.status === 202) {
                setName(formatName(name));
                if ( usertype === 'Staff')  {
                    console.log(`Welcome, ${name}`);
                } else if( usertype === 'Student') {
                    navigate('/studenthomepage');
                } else if( usertype === 'Company') {
                    navigate('/companyhomepage');
                }  
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error(error.response.data);
            navigate('/login'); 
        }
    };

    const goNext = () => {
        if (currentIndex < announcements.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const username = 'user';
    const password = 'a5836267-68d8-48f2-b10e-61f5ac65b44b'; // Replace this with the actual generated password
    const credentials = btoa(`${username}:${password}`);

const response = await axios.get('https://icis-production.up.railway.app/api/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error(error.response.data);
        }
    };

    useEffect(() => {
        checkAuthentication();
        fetchAnnouncements();
    }, [navigate]);



    return (
        <div>
            <div className="red-bar-staff">
                <div className="logo-container-staff">
                    <img src={iytelogo} alt="Logo" className="logo-staff" />
                </div>
                <div className="buttons-container-staff">
                    <button className="redbarbutton-staff" onClick={() => handleClick("/manageinternshipopportunities")}>Manage Internship Opportunities</button>
                    <button className="redbarbutton-staff" onClick={() => handleClick("/managecompanies")}>Manage Companies</button>
                    <button className="redbarbutton-staff" onClick={() => handleClick("/sgk")}>SGK</button>
                    <button className="redbarbutton-staff" onClick={() => handleClick("/approveforms")}>Approve Forms</button>
                </div>
                <div className="profile-staff" onClick={() => setShowDropdown(!showDropdown)}>
                    <h1>{name}</h1>
                    {showDropdown && (
                        <div className="dropdown-menu-staff">
                            <button onClick={handleLogout} className="dropdown-item-staff">Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="main-content-staff">
                <button onClick={goPrevious} className='previous-button-staff'>&lt;</button>
                <div className="announcements-container-staff">
                    <h2 className="announcements-title-staff">ANNOUNCEMENTS</h2>
                    {announcements.length > 0 && (
                        <div className="announcement-viewer-staff">
                            <div className="announcement-item-staff">
                                <h3>{announcements[currentIndex].title}</h3>
                                <p>{announcements[currentIndex].description}</p>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={goNext} className='next-button-staff'>&gt;</button>
            </div>
        </div>
    );
}

export default StaffHomePage;
