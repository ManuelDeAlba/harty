import React, { useEffect } from 'react';

const ScriptImports = () => {
  useEffect(() => {
    // Agrega las importaciones de tus scripts aquí
    const scriptSources = [
      'assets/js/jquery-1.11.3.min.js',
      'assets/bootstrap/js/bootstrap.min.js',
      'assets/js/jquery.countdown.js',
      'assets/js/jquery.isotope-3.0.6.min.js',
      'assets/js/waypoints.js',
      'assets/js/owl.carousel.min.js',
      'assets/js/jquery.magnific-popup.min.js',
      'assets/js/jquery.meanmenu.min.js',
      'assets/js/sticker.js',
      'assets/js/main.js'
    ];

    scriptSources.forEach((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
  }, []);

  return null;
};

export default ScriptImports;
