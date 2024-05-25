import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import iytelogo from "../Assets/iytelogo.png";
import './Student.css';
import '../PopUp.css';

const StudentHomePage = () => {
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

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
            const response = await axios.post('http://localhost:8080/api/checktoken', {}, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const { usertype, name } = response.data;

            if (response.status === 202) {
                setName(formatName(name));
                if (usertype === 'Student')  {
                    console.log(`Welcome, ${name}`);
                } else if (usertype === 'Staff') {
                    navigate('/staffhomepage');
                } else if (usertype === 'Company') {
                    navigate('/companyhomepage');
                }    
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
            const response = await axios.get('http://localhost:8080/api/announcements');
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
            <div className="red-bar-student">
                <div className="logo-container-student" onClick={() => handleClick("/studenthomepage")}>
                    <img src={iytelogo} alt="Logo" className="logo-student" />
                </div>
                <div className="buttons-container-student">
                    <button className="redbarbutton-student" onClick={() => handleClick("/internshipopportunities")}>Internship Opportunities</button>
                    <button className="redbarbutton-student" onClick={() => handleClick("/approvedapplication")}>Approved Application</button>
                </div>
                <div className="profile-student" onClick={() => setShowDropdown(!showDropdown)}>
                    <h1>{name}</h1>
                    {showDropdown && (
                        <div className="dropdown-menu-student">
                            <button onClick={handleLogout} className="dropdown-item-student">Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="main-content-student">
            <button onClick={goPrevious} className='previous-button-student'>&lt;</button>
                <div className="announcements-container-student">
                    <h2 className="announcements-title-student">ANNOUNCEMENTS</h2>
                    {announcements.length > 0 && (
                        <div className="announcement-viewer-student">
                            <div className="announcement-item-student">
                                <h3>{announcements[currentIndex].title}</h3>
                                <p>{announcements[currentIndex].description}</p>
                            </div>
                        </div>
                    )}
                </div>
            <button onClick={goNext} className='next-button-student'>&gt;</button>
            </div>
        </div>
    );
}

export default StudentHomePage;
