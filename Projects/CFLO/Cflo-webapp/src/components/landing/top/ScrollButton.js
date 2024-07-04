import React from 'react';

const ScrollButton = () => {
  return (
    <div className="scrollButton" onClick={() => window.setPage(1)}>
      <div className="icon" />
    </div>
  );
};

export default ScrollButton;
