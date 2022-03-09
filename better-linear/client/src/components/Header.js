import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="">
            <div className="">
                <Link to="/" className="no-underline black">
                    <div className="fw7 mr1">B-Linear</div>
                </Link>        
                <Link to="/signin" className="">
                    Sign In
                </Link>
                <Link to="/signup" className="">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default Header;