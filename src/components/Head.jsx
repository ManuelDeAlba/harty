import React from 'react';
import { Helmet } from 'react-helmet';

// HeadComponent para usar como head en las páginas: <Head/>
function Head() {
  return (
    <div>
      <script>
        window.jQuery = window.$ = require('jquery');
      </script>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/x-icon" href="assets/img/favicon.png" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="assets/css/all.min.css" />
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="assets/css/owl.carousel.css" />
        <link rel="stylesheet" href="assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="assets/css/animate.css" />
        <link rel="stylesheet" href="assets/css/meanmenu.min.css" />
        <link rel="stylesheet" href="assets/css/main.css" />
        <link rel="stylesheet" href="assets/css/responsive.css" />
      </Helmet>
    </div>
  );
}

export default Head;
