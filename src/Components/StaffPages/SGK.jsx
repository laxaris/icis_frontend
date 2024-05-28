import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import './Staff.css';
import '../PopUp.css';

const SGK = () => {
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [internships, setInternships] = useState([]);
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
            const username = 'user';
    const password = 'a5836267-68d8-48f2-b10e-61f5ac65b44b'; // Replace this with the actual generated password
    const credentials = btoa(`${username}:${password}`);

const response = await axios.get('https://icis-production.up.railway.app/api/staffshowinternshipsstarted', {
                headers: { 'Authorization': `${token}` }
            });
            setInternships(response.data);
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
                {internships.map((internship) => (
                    <div key={internship.applicationId} className="offername-item-staff">
                        <span className='companyname-staff'>{internship.studentName} {internship.studentSurname}</span>
                        <span className='companyname-staff'>{internship.offerName}</span>
                        <button className="view-button-staff" onClick={() => handleClick(`/sgkdetail/${internship.applicationId}`)}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SGK;
