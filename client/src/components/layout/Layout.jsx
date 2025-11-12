import React from 'react';

const Layout = ({ children }) => {
	return (
		<div>
			{/* Main Layout - Wrapper with Navbar/Sidebar + main content area */}
			{children}
		</div>
	);
};

export default Layout;
