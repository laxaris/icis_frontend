import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";
import './Student.css';
import '../PopUp.css';

const ApprovedApplication = () => {
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

    const handleApproveReject = async (applicationId, isApprove) => {
        const token = Cookies.get("jwtToken");
        setIsSubmitting(true);
    
        try {
            const response = await axios.post(`http://localhost:8080/api/studentapprovedapplications/${applicationId}`, {}, {
                headers: {
                    "Authorization": `${token}`,
                    "isApprove": isApprove
                }
            });
    
            if (response.status === 202) {
                setMessage(response.data);
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    fetchstudents();
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
    

    const fetchstudents = async () => {
        const token = Cookies.get("jwtToken");
        try {
            const response = await axios.get("http://localhost:8080/api/studentapprovedapplications", {
                headers: { "Authorization": `${token}` }
            });
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
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
                if ( usertype === 'Student')  {
                    console.log(`Welcome, ${name}`);
                } else if ( usertype === 'Staff') {
                    navigate('/Staffhomepage');
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
            fetchstudents();
        }
    };

    useEffect(() => {
        authenticateAndFetch();
    }, [navigate]);

    return (
        <div>
            <div className="red-bar-student">
                <div className="logo-container-student" onClick={() => handleClick("/staffhomepage")}>
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
            <div className="applications-container-student">
                {companies.map((company) => (
                    <div key={company.applicationId} className="applications-item-student">
                        <span className='company-student'>{company.companyName}</span>
                        <span className='company-student'>{company.offerName}</span>
                        <div className='approve-reject-buttons-student'>
                            <button className="approve-button-student" onClick={() => handleApproveReject(company.applicationId, true)} disabled={isSubmitting}>Approve</button>
                            <button className="reject-button-student" onClick={() => handleApproveReject(company.applicationId, false)} disabled={isSubmitting}>Reject</button>
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

export default ApprovedApplication;
