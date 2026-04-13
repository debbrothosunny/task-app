"use client";

import React, { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // 1. Added new state for displaying errors
    const [error, setError] = useState(''); 
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. For session-based authentication, setting CSRF cookie first is required
            // This should be defined in your lib/axios
            await axios.get('/sanctum/csrf-cookie');

            // 2. Send login request
            // On success, the server will set HttpOnly cookie in the browser
            await axios.post('/api/login', { email, password });

            // 3. No need to save token (LocalStorage Clean)
            // Directly navigate to feed page
            router.push('/feed');
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid credentials. Please try again.');
            } else {
                setError('Something went wrong. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="_social_login_wrapper _layout_main_wrapper">
            {/* Shapes Section */}
            <div className="_shape_one">
                <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
            </div>
            <div className="_shape_two">
                <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>
            <div className="_shape_three">
                <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
                <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
            </div>

            <div className="_social_login_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Left Side Image */}
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_login_left">
                                <div className="_social_login_left_image">
                                    <img src="/assets/images/login.png" alt="Image" className="_left_img" />
                                </div>
                            </div>
                        </div>

                        {/* Right Side Content */}
                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_login_content">
                                <div className="_social_login_left_logo _mar_b28">
                                    <img src="/assets/images/logo.svg" alt="Image" className="_left_logo" />
                                </div>
                                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                                <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
                                
                                <button type="button" className="_social_login_content_btn _mar_b40">
                                    <img src="/assets/images/google.svg" alt="Image" className="_google_img" /> 
                                    <span>Or sign-in with google</span>
                                </button>

                                <div className="_social_login_content_bottom_txt _mar_b40"> 
                                    <span>Or</span>
                                </div>

                                <form className="_social_login_form" onSubmit={handleLogin}>
                                    {/* 5. UI for displaying error message */}
                                    {error && (
                                        <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                                            {error}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Email</label>
                                                <input 
                                                    type="email" 
                                                    className="form-control _social_login_input"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <div className="_social_login_form_input _mar_b14">
                                                <label className="_social_login_label _mar_b8">Password</label>
                                                <input 
                                                    type="password" 
                                                    className="form-control _social_login_input"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                                            <div className="form-check _social_login_form_check">
                                                <input className="form-check-input _social_login_form_check_input" type="checkbox" id="rememberMe" />
                                                <label className="form-check-label _social_login_form_check_label" htmlFor="rememberMe">Remember me</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                                            <div className="_social_login_form_left text-end">
                                                <Link href="#" style={{ textDecoration: 'none' }}>
                                                    <p className="_social_login_form_left_para" style={{ cursor: 'pointer' }}>Forgot password?</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                                            <div className="_social_login_form_btn _mar_t40 _mar_b60">
                                                <button 
                                                    type="submit" 
                                                    className="_social_login_form_btn_link _btn1"
                                                    disabled={loading}
                                                >
                                                    {loading ? "Logging in..." : "Login now"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                        <div className="_social_login_bottom_txt">
                                            <p className="_social_login_bottom_txt_para">Dont have an account? 
                                                <Link href="/register"> Create New Account</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}