'use client';

import { useState } from 'react';

export function MessengerButton() {
    const [isHovered, setIsHovered] = useState(false);

    const handleMessengerClick = () => {
        // Replace with your actual Facebook page username or ID
        const facebookPageId = 'nextbyteitinstitute'; // You can also use your page username
        const messengerUrl = `https://m.me/${facebookPageId}`;

        window.open(messengerUrl, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-24 z-50">
            <button
                onClick={handleMessengerClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
          group relative flex items-center cursor-pointer justify-center w-14 h-14 rounded-full shadow-lg
          transition-all duration-300 ease-in-out transform hover:scale-110
          ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
        `}
                style={{
                    background: 'linear-gradient(135deg, #0084FF 0%, #0066CC 100%)',
                }}
                aria-label="Contact us on Messenger"
            >
                {/* Messenger Icon */}
                <svg
                    className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.64c-.122.58-.44.72-.89.45l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.56 4.59-4.14c.2-.18-.04-.28-.31-.1l-5.68 3.57-2.45-.77c-.53-.16-.54-.53.11-.79l9.57-3.69c.44-.16.83.1.69.79z" />
                </svg>

                {/* Tooltip */}
                <div className={`
          absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-2 
          bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
        `}>
                    Chat with us on Messenger
                    <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>

                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#0084FF' }}></div>
            </button>
        </div>
    );
}
