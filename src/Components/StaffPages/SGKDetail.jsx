import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";
import './Staff.css';
import '../PopUp.css';

const SGKDetail = () => {
    const { applicationId } = useParams();
    const [name, setName] = useState("");
    const [details, setDetails] = useState({});
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [file, setFile] = useState(null);
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

    const closePopupAndRefresh = () => {
        setShowPopup(false);
        navigate(0);
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
            const response = await axios.get(`http://localhost:8080/api/staffshowinternshipsstarted/${applicationId}`, {
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) {
            setMessage("No file selected.");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = Cookies.get("jwtToken");
            const response = await axios.post(`http://localhost:8080/api/uploadsgkdocument/${applicationId}`, formData, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setMessage(response.data);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        } catch (error) {
            console.error(error.response.data);
            setMessage(error.response.data);
            setShowPopup(true);
            setTimeout(() => closePopupAndRefresh(), 2000);
        }
    };

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
                        <div className="internship-container-staff">
                            <div className="internships-staff">
                            <div className="internship-staff">
                                <h3><strong>Internship Details</strong></h3>
                            </div>
                            <div className="internship-detail-staff">
                                <h3><strong>Name: </strong> <span className="student-name-surname">{details.studentName} {details.studentSurname}</span></h3>
                            </div>
                            <div className="internship-detail-staff">
                                <h3><strong>Company Name: </strong> <span className="company-name">{details.companyName}</span></h3>
                            </div>
                            <div className="internship-detail-staff">
                                <h3><strong>Offer Name: </strong> <span className="offer-name">{details.offerName}</span></h3>
                            </div>
                            <div className="internship-detail-staff">
                                <h3><strong>Grade: </strong> <span className="student-grade">{details.grade}</span></h3>
                            </div>
                            <div className="internship-detail-staff">
                                <h3><strong>Student Id: </strong> <span className="student-number">{details.studentId}</span></h3>
                            </div>
                            </div>
                            <div className="upload-button-staff">
                                <input type="file" onChange={handleFileChange} accept=".docx" className="input-staff"/>
                                <button onClick={uploadFile} className="button-staff">Upload Document</button>
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

export default SGKDetail;