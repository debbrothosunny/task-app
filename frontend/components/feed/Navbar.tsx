"use client";

import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import instance, { getCsrfToken } from '@/lib/axios';

export default function Navbar() {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const router = useRouter();
    
    const profileRef = useRef<HTMLDivElement>(null);
    const notifyRef = useRef<HTMLDivElement>(null);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            // ১. প্রথমে CSRF কুকি সেট করে নিন (সেম-সাইট সিকিউরিটির জন্য)
            await getCsrfToken(); 
            
            // ২. এরপর লগআউট রিকোয়েস্ট পাঠান
            await instance.post('/api/logout');
        } catch (error) {
            console.error("Logout failed at server, but we will clear local state.");
        } finally {
            // ৩. সেশন কুকি সার্ভার সাইডে ডিলিট হলেও লোকাল থেকে টোকেন/ইউজার ডাটা মুছে দিন
            localStorage.removeItem('token'); 
            window.location.href = '/login'; // ইন্টারসেপ্টরের সাথে মিল রেখে রিডাইরেক্ট
        }
    };

    // Sample notifications data
    const notifications = [
        { id: 1, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 2, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: true },
        { id: 3, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: false },
        { id: 4, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
        { id: 5, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 6, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
        { id: 7, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 8, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
        { id: 9, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 10, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
        { id: 11, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 12, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
        { id: 13, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 14, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
        { id: 15, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 16, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
        { id: 17, text: "Steve Jobs posted a link in your timeline.", time: "42 minutes ago", unread: true },
        { id: 18, text: "An admin changed the name of the group Freelacer usa to Freelacer usa", time: "42 minutes ago", unread: false },
    ];

    const filteredNotifications = activeTab === 'all' 
        ? notifications 
        : notifications.filter(n => n.unread);

    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
                setIsNotifyOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) return <div className="_header_nav" style={{ height: '70px', background: '#fff' }}></div>;

    return (
        <nav className="_header_nav sticky-top shadow-sm bg-white py-2">
            <div className="container d-flex align-items-center justify-content-between">
                
                {/* Logo */}
                <div className="_logo_wrap flex-shrink-0">
                    <Link href="/feed">
                        <Image 
                            src="/assets/images/logo.svg" 
                            alt="Logo" 
                            width={140} 
                            height={35} 
                            priority 
                        />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="_header_form d-none d-lg-block flex-grow-1 mx-4" style={{ maxWidth: '400px' }}>
                    <div className="position-relative">
                        <svg className="position-absolute top-50 start-0 translate-middle-y ms-3" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <circle cx="7" cy="7" r="6" stroke="#999" />
                            <path stroke="#999" strokeLinecap="round" d="M16 16l-3-3" />
                        </svg>
                        <input 
                            className="form-control rounded-pill bg-light border ps-5 py-2" 
                            type="search" 
                            placeholder="Search BuddyScript..." 
                            style={{ border: '1px solid #e0e0e0' }}
                        />
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="d-flex align-items-center gap-2 gap-md-4">
                    
                    {/* Home Icon */}
                    <Link href="/feed" className="p-2 rounded-circle" title="Home">
                        <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
                            <path 
                                stroke={pathname === '/feed' ? "#377DFF" : "#666"} 
                                strokeWidth="1.5" 
                                strokeOpacity={pathname === '/feed' ? "1" : ".6"}
                                d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" 
                            />
                            <path 
                                stroke={pathname === '/feed' ? "#377DFF" : "#666"} 
                                strokeOpacity={pathname === '/feed' ? "1" : ".6"}
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="1.5" 
                                d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" 
                            />
                        </svg>
                    </Link>

                    {/* Friend Request Icon */}
                    <Link href="#" className="p-2 rounded-circle" title="Friends">
                        <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
                            <path fill="#666" fillOpacity=".6" fillRule="evenodd" d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75zm7.27-.607a4.222 4.222 0 013.566 4.172c-.004 2.094-1.58 3.89-3.665 4.181a.88.88 0 01-.994-.745.875.875 0 01.75-.989 2.494 2.494 0 002.147-2.45 2.473 2.473 0 00-2.09-2.443.876.876 0 01-.726-1.005.881.881 0 011.013-.721zm-13.528.72a.876.876 0 01-.726 1.006 2.474 2.474 0 00-2.09 2.446A2.493 2.493 0 005.86 7.762a.875.875 0 11-.243 1.734c-2.085-.29-3.66-2.087-3.664-4.179 0-2.082 1.5-3.837 3.566-4.174a.876.876 0 011.012.72z" clipRule="evenodd" />
                        </svg>
                    </Link>

                    {/* Chat Icon */}
                    <Link href="#" className="p-2 rounded-circle position-relative" title="Messages">
                        <svg width="23" height="22" viewBox="0 0 23 22" fill="none">
                            <path fill="#666" fillOpacity=".6" fillRule="evenodd" d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z" clipRule="evenodd" />
                        </svg>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px', padding: '2px 5px' }}>2</span>
                    </Link>

                    {/* Notifications Dropdown */}
                    <div className="position-relative" ref={notifyRef}>
                        <div 
                            className="p-2 rounded-circle position-relative"
                            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                            style={{ cursor: 'pointer' }}
                        >
                            <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                                <path fill="#666" fillOpacity=".6" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                            </svg>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px', padding: '2px 5px' }}>{unreadCount}</span>
                        </div>

                        {/* Notification Dropdown Content */}
                        {isNotifyOpen && (
                            <div 
                                className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-3 border-0"
                                style={{ width: '400px', maxWidth: '90vw', zIndex: 1060 }}
                            >
                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
                                    <h4 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>Notifications</h4>
                                    <div className="position-relative">
                                        <button type="button" className="btn p-0" style={{ opacity: 0.6 }}>
                                            <svg width="4" height="17" viewBox="0 0 4 17" fill="none">
                                                <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                                <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                                <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Tab Buttons */}
                                <div className="d-flex border-bottom px-4 pt-2 gap-4">
                                    <button 
                                        onClick={() => setActiveTab('all')}
                                        className="btn btn-sm px-0 fw-semibold"
                                        style={{ 
                                            color: activeTab === 'all' ? '#377DFF' : '#6c757d',
                                            borderBottom: activeTab === 'all' ? '2px solid #377DFF' : 'none',
                                            borderRadius: 0,
                                            paddingBottom: '8px'
                                        }}
                                    >
                                        All
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('unread')}
                                        className="btn btn-sm px-0 fw-semibold"
                                        style={{ 
                                            color: activeTab === 'unread' ? '#377DFF' : '#6c757d',
                                            borderBottom: activeTab === 'unread' ? '2px solid #377DFF' : 'none',
                                            borderRadius: 0,
                                            paddingBottom: '8px'
                                        }}
                                    >
                                        Unread
                                    </button>
                                </div>

                                {/* Notifications List - Text only, no images */}
                                <div className="notifications-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {filteredNotifications.map((notification) => (
                                        <div 
                                            key={notification.id}
                                            className="px-4 py-3 border-bottom hover-bg-light"
                                            style={{ 
                                                cursor: 'pointer', 
                                                transition: 'background 0.2s',
                                                backgroundColor: notification.unread ? '#f0f7ff' : 'transparent'
                                            }}
                                        >
                                            <div className="flex-grow-1">
                                                <p className="mb-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                                    {notification.text}
                                                </p>
                                                <small className="text-muted" style={{ fontSize: '12px' }}>
                                                    {notification.time}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-3 border-top text-center">
                                    <button className="btn btn-link text-decoration-none p-0" style={{ fontSize: '13px', color: '#377DFF' }}>
                                        View All Notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="position-relative" ref={profileRef}>
                        <div 
                            className="d-flex align-items-center gap-2 ps-1 pe-2 py-1 rounded-pill" 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="rounded-circle overflow-hidden" style={{ width: '35px', height: '35px' }}>
                                <Image 
                                    src="/assets/images/profile.png" 
                                    alt="User" 
                                    width={35} 
                                    height={35} 
                                    className="object-fit-cover"
                                />
                            </div>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4-.708.708 4 4 .708-.708z" />
                            </svg>
                        </div>

                        {isProfileOpen && (
                            <div 
                                className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-3 border-0 py-2"
                                style={{ minWidth: '220px', zIndex: 1060 }}
                            >
                                <div className="px-3 py-2 border-bottom">
                                    <p className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Dylan Field</p>
                                    <small className="text-muted">Designer</small>
                                </div>
                                <Link href="#" className="dropdown-item px-3 py-2 d-flex align-items-center gap-3">
                                    <span>View Profile</span>
                                </Link>
                                <Link href="#" className="dropdown-item px-3 py-2 d-flex align-items-center gap-3">
                                    <span>Settings</span>
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="dropdown-item px-3 py-2 text-danger border-0 bg-transparent w-100 text-start hover:bg-red-50 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: #f8f9fa;
                }
                .dropdown-item {
                    display: block;
                    width: 100%;
                    padding: 8px 16px;
                    clear: both;
                    font-weight: 400;
                    color: #212529;
                    text-align: inherit;
                    text-decoration: none;
                    white-space: nowrap;
                    background-color: transparent;
                    border: 0;
                    cursor: pointer;
                }
                .dropdown-item:hover {
                    background-color: #f8f9fa;
                }
                .dropdown-divider {
                    height: 0;
                    margin: 8px 0;
                    overflow: hidden;
                    border-top: 1px solid #e9ecef;
                }
                .btn-link {
                    font-weight: 400;
                    text-decoration: none;
                }
                .btn-link:hover {
                    text-decoration: underline;
                }
                .rounded-circle {
                    border-radius: 50% !important;
                }
                .position-relative {
                    position: relative;
                }
                .position-absolute {
                    position: absolute;
                }
                .top-0 {
                    top: 0;
                }
                .start-100 {
                    left: 100%;
                }
                .translate-middle {
                    transform: translate(-50%, -50%);
                }
                .badge {
                    display: inline-block;
                    padding: 0.25em 0.4em;
                    font-size: 75%;
                    font-weight: 700;
                    line-height: 1;
                    text-align: center;
                    white-space: nowrap;
                    vertical-align: baseline;
                    border-radius: 0.375rem;
                }
                .bg-danger {
                    background-color: #dc3545;
                }
                .text-white {
                    color: #fff;
                }
                .notifications-list::-webkit-scrollbar {
                    width: 6px;
                }
                .notifications-list::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                .notifications-list::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                .notifications-list::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </nav>
    );
}