import React from 'react';

function Footer() {
    return (
        <footer className="bg-blue-700 text-white min-h-36 text-center py-4 ">
            <p className="text-sm">&copy; {new Date().getFullYear()} Zaalima Web Development. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
