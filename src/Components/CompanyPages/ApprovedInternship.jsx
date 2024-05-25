import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import './Company.css';
import '../PopUp.css';

const ApprovedInternship = () => {
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [applications, setApplications] = useState([]);
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
            return false;
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
                if ( usertype === 'Company')  {
                    console.log(`Welcome, ${name}`);
                } else if( usertype === 'Staff') {
                    navigate('/staffhomepage');
                } else if( usertype === 'Student') {
                    navigate('/studenthomepage');
                }    
                return true;
            }
        } catch (error) {
            console.error(error.response.data);
            navigate('/login'); 
        }
        return false;
    };

    const fetchapplications = async () => {
        const token = Cookies.get('jwtToken');
        try {
            const response = await axios.get('http://localhost:8080/api/applicationstocompany', {
                headers: { 'Authorization': `${token}` }
            });
            setApplications(response.data);
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const authenticateAndFetch = async () => {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
            const token = Cookies.get('jwtToken');
            fetchapplications(token);
        }
    };

    useEffect(() => {
        authenticateAndFetch();
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
                <div className="application-container-company">
                {applications.map((application) => (
                    <div key={application.applicationId} className="offername-item-company">
                        <span className='studentname-company'>{application.studentName} {application.studentSurname}</span>
                        <button className="view-button-company" onClick={() => handleClick(`/approvedinternshipdetail/${application.applicationId}`)}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ApprovedInternship;
