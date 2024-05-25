import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import './Student.css';
import '../PopUp.css';

const InternshipOpportunities = () => {
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [opportunities, setOpportunities] = useState([]);
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
                if ( usertype === 'Student')  {
                    console.log(`Welcome, ${name}`);
                } else if( usertype === 'Staff') {
                    navigate('/staffhomepage');
                } else if( usertype === 'Company') {
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
            const response = await axios.get('http://localhost:8080/api/showoffers', {
                headers: { 'Authorization': `${token}` }
            });
            setOpportunities(response.data);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
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
                <div className="opportunities-container-student">
                {opportunities.map((opportunity) => (
                    <div key={opportunity.offerid} className="offername-item-student">
                        <span className='companyname-student'>{opportunity.offername}</span>
                        <button className="view-button-student" onClick={() => handleClick(`/opportunitydetail/${opportunity.offerid}`)}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InternshipOpportunities;
