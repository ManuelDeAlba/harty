import React, { useEffect } from 'react';

function LoadScripts() {
  useEffect(() => {
    function LoadScripts(scripts, callback) {
      const head = document.getElementsByTagName('head')[0];
      let loadedCount = 0;

      function loadScript(index) {
        if (index >= scripts.length) {
          // Todos los scripts se han cargado
          callback();
          return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scripts[index];
        script.async = true;

        script.onload = () => {
          loadedCount++;
          if (loadedCount === scripts.length) {
            // Cuando se han cargado todos los scripts, llamamos al callback
            callback();
          } else {
            // Cargamos el siguiente script
            loadScript(index + 1);
          };
        }

        script.onerror = (error) => {
          // Manejo de errores si el script no se carga correctamente
          console.error('Error al cargar el script:', error);
          // Continuamos cargando el siguiente script
          loadScript(index + 1);
        }

        head.appendChild(script);
      }

      // Comenzamos cargando el primer script
      loadScript(0);
    }

    const scriptsToLoad = [
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

    LoadScripts(scriptsToLoad, () => {
      // Los scripts se han cargado, puedes realizar acciones adicionales si es necesario
    });
  }, []);

  return null;
}

export default LoadScripts;
