import React from 'react';

const SmallScreenBanner: React.FC = () => {

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 bg-blue-600 p-4 text-center text-white">
      <p>
        This website is under development, <strong>Stay tune to us </strong>
        Order your medicine through <strong>ShopU</strong> mobile application or WhatsApp on <strong>8235989891</strong>
      </p>
    </div>
  );
};

export default SmallScreenBanner;
