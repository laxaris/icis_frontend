import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import './Company.css';
import '../PopUp.css';

const CompanyHomePage = () => {
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
            const response = await axios.post('http://localhost:8080/api/checktoken', {}, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const { usertype, name } = response.data;

            if (response.status === 202) {
                setName(formatName(name));
                if( usertype === 'Company') {
                    console.log(`Welcome, ${name}`);
                } else if( usertype === 'Staff') {
                    navigate('/staffhomepage');
                } else if( usertype === 'Student') {
                    navigate('/studenthomepage');
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
            <div className="red-bar-company">
                <div className="logo-container-company" onClick={() => handleClick("/companyhomepage")}>
                    <img src={iytelogo} alt="Logo" className="logo-company" />
                </div>
                <div className="buttons-container-company">
                    <button className="redbarbutton-company" onClick={() => handleClick("/createinternshipannouncement")}>Create Internship Announcement</button>
                    <button className='redbarbutton-company' onClick={() => handleClick('/approvedinternship')}>Approved Internship</button>
                    <button className='redbarbutton-company' onClick={() => handleClick('/applicationform')}>Application Form</button>
                </div>
                <div className="profile-company" onClick={() => setShowDropdown(!showDropdown)}>
                    <h1>{name}</h1>
                    {showDropdown && (
                        <div className="dropdown-menu-company">
                            <button onClick={handleLogout} className="dropdown-item-company">Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="main-content-company">
                <button onClick={goPrevious} className='previous-button-company'>&lt;</button>
                <div className="announcements-container-company">
                    <h2 className="announcements-title-company">ANNOUNCEMENTS</h2>
                    {announcements.length > 0 && (
                        <div className="announcement-viewer-company">
                            <div className="announcement-item-company">
                                <h3>{announcements[currentIndex].title}</h3>
                                <p>{announcements[currentIndex].description}</p>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={goNext} className='next-button-company'>&gt;</button>
            </div>
        </div>
    );
}

export default CompanyHomePage;
