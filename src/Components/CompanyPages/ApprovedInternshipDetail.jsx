import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";
import './Company.css';
import '../PopUp.css';

const ApprovedInternshipDetail = () => {
    const { applicationId } = useParams();
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
            const response = await axios.post(`http://localhost:8080/api/approveapplicationstocompany/${applicationId}`,{},{
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
                if (usertype === "Company") {
                    console.log(`Welcome, ${name}`);
                } else if (usertype === "Student") { 
                    navigate("/studenthomepage");
                } else if (usertype === "Staff") {
                    navigate("/staffhomepage");
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
            const response = await axios.get(`http://localhost:8080/api/applicationstocompany/${applicationId}`, {
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
    }, [navigate, applicationId]);

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
            <div className="applications-company">
                <div className="application-details-company">
                    {details && (
                        <div className="application-company">
                            <div className="application-offername-company">
                                <h2><strong>Offer Name: </strong> <span className="offer-name">{details.offerName}</span></h2>
                            </div>
                            <div className="application-namesurname-company">
                                <h3><strong>Name: </strong> <span className="name">{details.studentName} {details.studentSurname}</span></h3>
                            </div>
                            <div className="application-studentid-company">
                                <p><strong>Student Number: </strong> <span className="student-number">{details.studentId}</span></p>
                            </div>
                            <div className="application-grade-company">
                                <p><strong>Student Grade: </strong> <span className="student-grade">{details.grade}</span></p>
                            </div>
                            <div className="application-buttons-company">
                                <button className="approve-button-application-company" onClick={() => handleApproveReject(true)} disabled={isSubmitting}>Approve</button>
                                <button className="reject-button-application-company" onClick={() => handleApproveReject(false)} disabled={isSubmitting}>Reject</button>
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

export default ApprovedInternshipDetail;
