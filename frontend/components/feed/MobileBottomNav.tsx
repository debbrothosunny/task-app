// components/feed/MobileBottomNav.tsx
export default function MobileBottomNav() {
    return (
        <div className="_mobile_navigation_bottom_wrapper">
            <div className="_mobile_navigation_bottom">
                <ul className="_mobile_navigation_bottom_list">

                    {/* Home */}
                    <li className="_mobile_navigation_bottom_item">
                        <a href="/feed" className="_mobile_navigation_bottom_link active">
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" fill="none" viewBox="0 0 29 28">
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 2L3 12.5v14a2 2 0 002 2h19a2 2 0 002-2v-14L14.5 2z" />
                            </svg>
                        </a>
                    </li>

                    {/* Friends / Network */}
                    <li className="_mobile_navigation_bottom_item">
                        <a href="/friends" className="_mobile_navigation_bottom_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" fill="none" viewBox="0 0 29 28">
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                            </svg>
                        </a>
                    </li>

                    {/* Notification */}
                    <li className="_mobile_navigation_bottom_item">
                        <a href="#0" className="_mobile_navigation_bottom_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" fill="none" viewBox="0 0 29 28">
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 8a6 6 0 00-12 0v7l-2 2v1h16v-1l-2-2V8z" />
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 21a2 2 0 01-4 0" />
                            </svg>
                            <span className="_counting">2</span>
                        </a>
                    </li>

                    {/* Chat / Message */}
                    <li className="_mobile_navigation_bottom_item">
                        <a href="/messages" className="_mobile_navigation_bottom_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" fill="none" viewBox="0 0 29 28">
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15.5v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h2v4l4-4h8a2 2 0 002-2z" />
                            </svg>
                        </a>
                    </li>

                    {/* Profile */}
                    <li className="_mobile_navigation_bottom_item">
                        <a href="/profile" className="_mobile_navigation_bottom_link">
                            <div className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                U
                            </div>
                        </a>
                    </li>

                </ul>
            </div>
        </div>
    );
}