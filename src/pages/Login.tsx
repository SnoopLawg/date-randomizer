import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, isAuthenticated, loading, error } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const validateForm = (): boolean => {
        setFormError('');

        if (!email) {
            setFormError('Email is required');
            return false;
        }

        if (!password) {
            setFormError('Password is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // This is a microtask (Promise)
            const success = await login(email, password);

            if (success) {
                // Redirect will happen via the useEffect above
                console.log('Login successful');
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
                            <h2 className="text-center mb-0 text-white">Login</h2>
                        </div>
                        <div className="card-body" style={{ opacity: 0.9 }}>
                            {(formError || error) && (
                                <div className="alert alert-danger" role="alert">
                                    {formError || error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label" style={{ color: 'var(--primary-darkest)' }}>
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading || isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label" style={{ color: 'var(--primary-darkest)' }}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading || isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn"
                                        disabled={loading || isSubmitting}
                                        style={{
                                            backgroundColor: 'var(--primary-light)',
                                            color: 'var(--primary-darkest)',
                                            border: '1px solid var(--primary)',
                                        }}
                                    >
                                        {loading || isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </>
                                        ) : 'Login'}
                                    </button>
                                </div>

                                <p className="text-center mt-3" style={{ color: 'var(--primary-dark)' }}>
                                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign Up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 