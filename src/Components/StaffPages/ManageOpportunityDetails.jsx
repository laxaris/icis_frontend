import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";
import './Staff.css';
import '../PopUp.css';

const ManageOpportunityDetails = () => {
    const {offerid } = useParams();
    const [name, setName] = useState("");
    const [details, setDetails] = useState({});
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        Cookies.remove("jwtToken");
        navigate("/login");
    };

    const closePopupAndNavigateBack = () => {
        setShowPopup(false);
        navigate(-1);
    };

    const closePopupAndRefresh = () => {
        setShowPopup(false);
        navigate(0);
    };

    const handleApproveReject = async (isApprove) => {
        const token = Cookies.get("jwtToken");
        setIsSubmitting(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/approverejectoffer/${offerid}`,{},{
                headers: {
                    "Authorization": `${token}`,
                    'Content-Type': 'application/json',
                    "isApprove": isApprove
                }
            });

            if (response.status === 202) {
                setMessage(response.data);
                setShowPopup(true);
                setTimeout(() => closePopupAndNavigateBack(), 2000);
            } else {
                setMessage(response.data);
                setShowPopup(true);
                setTimeout(() => closePopupAndNavigateBack(), 2000);
            }
        } catch (error) {
            console.error(error.response.data);
            setMessage(error.response.data);
            setShowPopup(true);
            setTimeout(() => closePopupAndRefresh(), 2000);
        }
        setIsSubmitting(false);
    };

    const formatName = (name) => {
        return name
            .split('.')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
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
                if (usertype === "Staff") {
                    console.log(`Welcome, ${name}`);
                } else if (usertype === "Student") { 
                    navigate("/studenthomepage");
                } else if (usertype === "Company") {
                    navigate("/companyhomepage");
                }
                return true;
            }
        } catch (error) {
            console.error(error.response.data);
            navigate("/login");
        }
        return false;
    };

    const fetchOpportunityDetails = async () => {
        try {
            const token = Cookies.get("jwtToken");
            const response = await axios.get(`http://localhost:8080/api/manageoffers/${offerid}`, {
                headers: { "Authorization": `${token}` }
            });
            setDetails(response.data);
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const authenticateAndFetch = async () => {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
            fetchOpportunityDetails();
        }
    };

    useEffect(() => {
        authenticateAndFetch();
    }, [navigate, offerid]);

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
            <div className="opportunities-staff">
                <div className="opportunities-details-staff">
                    {details && (
                        <div className="opportunity-staff">
                            <div className="opportunity-header-staff">
                                <h2><strong>Company Name: </strong> <span className="company-name">{details.companyname}</span></h2>
                            </div>
                            <div className="opportunity-name-staff">
                                <h3><strong>Offer Name: </strong> <span className="offer-name">{details.offername}</span></h3>
                            </div>
                            <div className="opportunity-description-staff">
                                <h3><strong>Description:</strong></h3>
                                <p>{details.description}</p>
                            </div>
                            <div className="opportunity-buttons-staff">
                                <button className="approve-button-internship-staff" onClick={() => handleApproveReject(true)} disabled={isSubmitting}>Approve</button>
                                <button className="reject-button-internship-staff" onClick={() => handleApproveReject(false)} disabled={isSubmitting}>Reject</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
};

export default ManageOpportunityDetails;
