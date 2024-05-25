import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Popup from '../PopUp'; 
import iytelogo from "../Assets/iytelogo.png";
import './Auth.css';
import '../PopUp.css';

const IyteRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/iyteregister', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 202) {
                setMessage(response.data );
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/login');
                }, 2000);
            } else if (response.status === 400) {
                setMessage(response.data);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            } else {
                setMessage(response.data);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            }
        } catch (error) {
            setMessage(error.response?.data || 'Registration error: The server may be down.');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
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
            <form onSubmit={handleRegister}>
                <h1>Iyte Register</h1>
                <div className="input-box">
                    <input type="email" placeholder="Email" required
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required
                        value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Confirm Password" required
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <button className="button" type="submit" disabled={isSubmitting}>Register</button>
                <div className="register-link">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
                <div className="register-link">
                    <p>Are you a company? <Link to="/CompanyRegister">Register Here</Link></p>
                </div>
            </form>
            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
        </>
    );
}

export default IyteRegister;
