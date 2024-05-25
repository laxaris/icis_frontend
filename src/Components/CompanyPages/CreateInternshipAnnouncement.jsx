import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import Popup from '../PopUp';
import './Company.css';
import '../PopUp.css';

const CreateInternshipAnnouncement = () => {
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [announcement, setAnnouncement] = useState({
        offername: '',
        description: ''
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('jwtToken');
        navigate('/login');
    };

    const handleClick = (path) => {
        navigate(path);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnnouncement(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const token = Cookies.get('jwtToken');
        try {
            const response = await axios.post('http://localhost:8080/api/createoffer', {
                companyname: announcement.offername,
                offername: announcement.offername,
                description: announcement.description
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 202) {
                setMessage(response.data);
            } else {
                setMessage(response.data);
            }
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        } catch (error) {
            console.error(error.response.data);
            setMessage(error.response.data);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
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
                if (usertype === 'Company') {
                    console.log(`Welcome, ${name}`);
                } else if (usertype === 'Staff') {
                    navigate('/staffhomepage');
                } else if (usertype === 'Student') {
                    navigate('/studenthomepage');
                }
            }
        } catch (error) {
            console.error(error.response.data);
            navigate('/login');
        }
    };

    useEffect(() => {
        checkAuthentication();
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
            <div className="form-container-company">
                <h2>Create Internship Announcement</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-company">
                        <label htmlFor="offername">Offer Name:</label>
                        <input
                            type="text"
                            id="offername"
                            name="offername"
                            value={announcement.offername}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-company">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={announcement.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-button-company" disabled={isSubmitting}>Create Announcement</button>
                </form>
            </div>
            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
};

export default CreateInternshipAnnouncement;
