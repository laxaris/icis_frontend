import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";
import './Staff.css';
import '../PopUp.css';

const ManageCompanies = () => {
    const [name, setName] = useState("");
    const [companies, setCompanies] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        Cookies.remove("jwtToken");
        navigate("/login");
    };

    const formatName = (name) => {
        return name
            .split('.') 
            .map(part => part.charAt(0).toUpperCase() + part.slice(1)) 
            .join(' '); 
    };

    const handleApproveReject = async (companyId, isApprove) => {
        const token = Cookies.get("jwtToken");
        setIsSubmitting(true);
    
        try {
            const response = await axios.post(`http://localhost:8080/api/managecompanyapplication/${companyId}`, {}, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json",
                    "isApprove": isApprove
                }
            });
    
            if (response.status === 202) {
                setMessage(response.data);
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    fetchCompanies();
                }, 2000);
            } else {
                setMessage(response.data);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            }
        } catch (error) {
            console.error(error.response.data);
            setMessage(error.response.data);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        }
        setIsSubmitting(false);
    };
    

    const fetchCompanies = async () => {
        const token = Cookies.get("jwtToken");
        try {
            const response = await axios.get("http://localhost:8080/api/managecompanyapplication", {
                headers: { "Authorization": `${token}` }
            });
            setCompanies(response.data);
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const checkAuthentication = async () => {
        const token = Cookies.get("jwtToken");
        if (!token) {
            navigate("/login");
            return false;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/checktoken", {}, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
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
            navigate("/login");
        }
        return false;
    };

    const authenticateAndFetch = async () => {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
            fetchCompanies();
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
                {companies.map((company) => (
                    <div key={company.companyId} className="offername-item-staff">
                        <span className='companyname-staff'>{company.companyName}</span>
                        <div className='approve-reject-buttons-staff'>
                            <button className="approve-button-staff" onClick={() => handleApproveReject(company.companyId, true)} disabled={isSubmitting}>Approve</button>
                            <button className="reject-button-staff" onClick={() => handleApproveReject(company.companyId, false)} disabled={isSubmitting}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
};

export default ManageCompanies;
