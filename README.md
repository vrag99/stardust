<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Sahilgill24/StableStore">
    <img src="/ui/src/assets/logo.jpeg" alt="Logo" width="100" height="100">
  </a>

<h3 align="center">StableStore</h3>

  <p align="center" style="width:76ch;">
Welcome to Stardust .
Designed to streamline your operations and finances, StableStore offers a comprehensive suite of tools to manage your storage deals and monitor your performance.</p>
    <a href="https://stablestore.gitbook.io/stablestore">View Docs</a>
    ·
    <a href="https://github.com/Sahilgill24/StableStore/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Sahilgill24/StableStore/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## Get Started
<a href="https://stablestore.gitbook.io/stablestore"><strong>Explore the docs »</strong></a>
1.  Clone the repo
    ```sh
    git clone https://github.com/Sahilgill24/StableStore.git && cd StableStore
    ```
2.  Setup the environment files.
    ```sh
    # frontend/ui/.env
    VITE_BACKEND_URI=http://localhost:8080/api
    VITE_DATA_BACKEND_URI=http://localhost:3000
    ```
    ```sh
    # services/core/.env.development.local
    # PORT
    PORT=8080
    DATABASE_URL=

    # TOKEN

    SECRET_KEY=developemtn_secret_key

    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_MAIL=
    SMTP_APP_PASS=

    LOG_FORMAT = dev
    LOG_DIR = ../logs

    # CORS

    ORIGIN = 'http://localhost:5174'
    CREDENTIALS = true

    ```
3. Build and deploy
    ```sh
    cd backend && npm i && cd controllers && node apiserver.js && cd ../ # running our API server
    cd frontend/ui && yarn && yarn dev --port 5174 && cd ../../ # running our frontend 
    cd services/core && npm i && npm run dev
    ````

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

