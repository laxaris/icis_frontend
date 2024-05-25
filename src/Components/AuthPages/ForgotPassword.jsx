import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Popup from '../PopUp.jsx';
import iytelogo from "../Assets/iytelogo.png";
import './Auth.css';
import '../PopUp.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:8080/api/forgotpassword', { 
                email
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data);
            setShowPopup(true);

            if (response.status === 202) {
                setTimeout(() => {
                    navigate('/resetpassword');
                    setShowPopup(false);
                }, 2000); 
            }else if (response.status === 400) {
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            }
        } catch (error) {
            setMessage(error.response?.data || 'Error sending email: The server may be down.');
            setShowPopup(true);
            if (error.response?.status === 400) {
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            }
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <div className="red-bar">
                <div className="logo-container">
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
            </div>
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Forgot Password</h1>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button className="button" type="submit" disabled={isSubmitting} >Submit</button>
                <div className="register-link">
                    <p>Did you remember your password ?<Link to="/login">Login Here</Link></p>
                </div>
                </form>
                {showPopup && (
                    <Popup message={message} onClose={() => setShowPopup(false)} />
                )}
            </div>
        </>
    );
}

export default ForgotPassword;
