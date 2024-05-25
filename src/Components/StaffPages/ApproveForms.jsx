import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import './Staff.css';
import '../PopUp.css';

const ApproveForms = () => {
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
                if ( usertype === 'Staff')  {
                    console.log(`Welcome, ${name}`);
                } else if ( usertype === 'Student') {
                    navigate('/studenthomepage');
                } else if ( usertype === 'Company') {
                    navigate('/companyhomepage');
                }
                return true;
            }
        } catch (error) {
            console.error(error.response.data);
            navigate('/login'); 
        }
        return false;
    };

    const fetchOpportunities = async () => {
        const token = Cookies.get('jwtToken');
        try {
            const response = await axios.get('http://localhost:8080/api/approveforms', {
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
            fetchOpportunities(token);
        }
    };

    useEffect(() => {
        authenticateAndFetch();
    }, [navigate]);

    return (
        <div>
            <div className="red-bar-staff">
                <div className="logo-container-staff" onClick={() => handleClick("/staffhomepage")}>
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
            <div className="opportunities-container-staff">
                    {applications.map((application) => (
                    <div key={application.applicationId} className="offername-item-staff">
                        <span className='studentname-staff'>{application.studentName} {application.studentSurname}</span>
                        <button className="view-button-staff" onClick={() => handleClick(`/approveformdetail/${application.applicationId}`)}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ApproveForms;
