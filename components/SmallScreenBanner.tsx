import React, { useEffect, useState } from 'react';

const SmallScreenBanner: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Check screen size on initial render
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isSmallScreen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white text-center p-4 z-50">
      <p>
        Download the <strong>ShopU</strong> app from Playstore or use on bigger screens.
      </p>
    </div>
  );
};

export default SmallScreenBanner;