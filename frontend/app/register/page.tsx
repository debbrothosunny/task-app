"use client";

import React, { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    
    const [errors, setErrors] = useState<any>({}); 
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // ১. সেশন হ্যান্ডশেকের জন্য CSRF কুকি ফেচ করা
            await axios.get('/sanctum/csrf-cookie');

            // ২. রেজিস্ট্রেশন রিকোয়েস্ট পাঠানো
            await axios.post('/api/register', formData);

            // ৩. সফলতার মেসেজ দেখানো
            alert("Account created successfully! Please login to continue.");

            // ৪. লগইন পেজে রিডাইরেক্ট করা
            router.push('/login');

        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert("Something went wrong! Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="_social_registration_wrapper _layout_main_wrapper">
            <div className="_social_registration_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Left Side Image Section */}
                        <div className="col-xl-8 col-lg-8">
                            <div className="_social_registration_right">
                                <img src="/assets/images/registration.png" alt="Registration Illustration" />
                            </div>
                        </div>

                        {/* Right Side Form Section */}
                        <div className="col-xl-4 col-lg-4">
                            <div className="_social_registration_content">
                                <h4 className="_social_registration_content_title _mar_b50">Registration</h4>
                                
                                <form className="_social_registration_form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label">First Name</label>
                                                <input 
                                                    type="text" 
                                                    name="first_name"
                                                    className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} 
                                                    onChange={handleChange}
                                                    required 
                                                />
                                                {errors.first_name && <div className="text-danger small mt-1">{errors.first_name[0]}</div>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label">Last Name</label>
                                                <input 
                                                    type="text" 
                                                    name="last_name"
                                                    className="form-control" 
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        <div className="col-xl-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label">Email</label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                                    onChange={handleChange}
                                                    required 
                                                />
                                                {errors.email && <div className="text-danger small mt-1">{errors.email[0]}</div>}
                                            </div>
                                        </div>

                                        <div className="col-xl-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label">Password</label>
                                                <input 
                                                    type="password" 
                                                    name="password"
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        <div className="col-xl-12">
                                            <div className="_social_registration_form_input _mar_b14">
                                                <label className="_social_registration_label">Repeat Password</label>
                                                <input 
                                                    type="password" 
                                                    name="password_confirmation"
                                                    className="form-control" 
                                                    onChange={handleChange}
                                                    required 
                                                />
                                                {errors.password && <div className="text-danger small mt-1">{errors.password[0]}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="_social_registration_form_btn _mar_t40">
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="_social_registration_form_btn_link _btn1 w-100"
                                        >
                                            {loading ? 'Processing...' : 'Register Now'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}