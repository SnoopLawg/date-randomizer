import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your signup logic here
        console.log('Sign up data:', formData);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                            <h2 className="text-center mb-0 text-white">Sign Up</h2>
                        </div>
                        <div className="card-body" style={{  opacity: 0.9 }}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label" style={{ color: 'var(--primary-darkest)' }}>
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label" style={{ color: 'var(--primary-darkest)' }}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label" style={{ color: 'var(--primary-darkest)' }}>
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn"
                                        style={{
                                            backgroundColor: 'var(--primary-light)',
                                            color: 'var(--primary-darkest)',
                                            border: '1px solid var(--primary)',
                                        }}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                                <p className="text-center mt-3" style={{ color: 'var(--primary-dark)' }}>
                                    Already have an account? <Link to="/signin" style={{ color: 'var(--primary)' }}>Sign In</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp; 