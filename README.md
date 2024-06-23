<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/vrag99/stardust">
    <img src="/ui/src/assets/logo.jpeg" alt="Logo" width="100" height="100">
  </a>

<h1 align="center">StardDust</h3>

  <p align="center" style="width:76ch;">
Welcome to Stardust! We are excited to introduce you to our innovative platform designed to empower decentralized autonomous organizations (DAOs) with seamless liquidity lending and efficient management tools. 
</p>
    <a href="https://stardust.gitbook.io/stardust">View Docs</a>
    ·
    <a href="https://github.com/vrag99/stardust/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/vrag99/stardust/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<img src="/ui/images/7.jpeg">
<br/>


# Get Started
<a href="https://stardust.gitbook.io/stardust"><strong>Explore the docs for more technical Explanation »</strong></a>

## Key Features of Stardust

### Liquidity Lending Protocol:

- **Easy Signup with Dynamic:**
  - DAOs can easily sign up with Stardust using Dynamic, our user-friendly registration process.
  
- **Liquidity Dashboard:**
  - After signing up, DAOs can request liquidity directly from our intuitive liquidity dashboard.
  
- **Collateral Calculation and Payment:**
  - Our advanced algorithms calculate the required collateral. Once the collateral is provided and approved, Argent’s multi-signature keys are set up, giving DAO members secure access to the provided liquidity.

### DAO Management Tools:

- **Reputation Calculator:**
  - DAOs can utilize our reputation calculator to evaluate their chances of obtaining a loan. This tool leverages the Voyager API to analyze historical data and generate a reputation score, similar to a credit score.
  
- **Threshold-Based Approval:**
  - Only DAOs with a reputation score above a certain threshold will be approved for liquidity, ensuring a fair and risk-managed lending process.

### Why Choose Stardust?

- **Transparent and Secure:**
  - Our platform ensures the security of your funds and the transparency of our processes. Multi-signature keys and robust collateral assessments provide peace of mind.
  
- **Empowering DAOs:**
  - Stardust is committed to supporting DAOs by providing the tools they need to manage their liquidity and reputation effectively, allowing them to focus on their core missions.
  
- **Innovative and User-Friendly:**
  - Combining liquidity lending with reputation assessment, Stardust offers a unique, innovative, and user-friendly approach to DAO management.



# Internals of Stardust

Welcome to the Internals page of Stardust, where we delve into the technical workings of our project. Here's a comprehensive overview of how Stardust operates behind the scenes:

<br />
<img src="/ui/images/5.jpeg ">
<br/>
<img src="/ui/images/8.jpeg ">


- **Frontend Development:**
  - Built using React and Vite for a fast and responsive UI.
  - Enables easy navigation, signups, wallet management, and dashboard access for DAOs.

- **User Signup with Dynamic:**
  - Seamless and secure registration process for DAOs using Dynamic.
  - Users can select their wallets post-registration.

- **Wallet Management with Argent:**
  - Integration of Argent's multi-signature wallet setup for secure management.
  - Cairo contracts for multi-sig wallets located in the server folder.

- **Smart Contracts:**
  - Essential backend components written in Cairo for managing Stardust.
  - Includes:
    - Collateral Manager: Manages DAO collateral for liquidity.
    - Vault: Storage and management of platform assets.
    - Stable Coin: Contract for the platform’s stablecoin transactions.
    - Staking Rewards Token: Manages rewards tokens for staking.
    - DAO Factory: Creates and manages new DAOs on the platform.
    - Pool Manager: Oversees liquidity pools for efficient management.
    - Auction File: Manages auction mechanisms including collateral liquidation.
    - Governance File: Handles governance mechanisms of the platform.

- **Interaction with Frontend:**
  - Real-time data interaction between smart contracts and frontend.
  - Examples include Liquidity Provider Dashboard, Credit Score Dashboard, and Governance Dashboard using Voyage API for transparency.

- **Detailed Contract Descriptions:**
  - In-depth explanations of major contracts used within Stardust.
  
By leveraging these technologies and contracts, Stardust ensures a secure, efficient, and user-friendly experience for DAOs. This integrated approach allows us to provide a comprehensive liquidity lending and DAO management solution.

# Mathematical explanation

Explanation of dynamic collateralization used on our platform 

<img src="/ui/images/1.jpeg ">
<br />
<img src="/ui/images/2.jpeg ">
<br />
<img src="/ui/images/4.jpeg ">
<br />
<img src="/ui/images/3.jpeg ">
<br />

After plotting the curve on desmos it looks something like this and here we can see the movement of the curve , we can adjust this by using any constant as normalization factor 


<br/>
<img src="/ui/images/image.png">

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/vrag99/stardust.svg?style=for-the-badge
[contributors-url]: https://github.com/vrag99/stardust/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vrag99/stardust.svg?style=for-the-badge
[forks-url]: https://github.com/vrag99/stardust/network/members
[stars-shield]: https://img.shields.io/github/stars/vrag99/stardust.svg?style=for-the-badge
[stars-url]: https://github.com/vrag99/stardust/stargazers
[issues-shield]: https://img.shields.io/github/issues/vrag99/stardust.svg?style=for-the-badge
[issues-url]: https://github.com/vrag99/stardust/issues
[license-shield]: https://img.shields.io/github/license/vrag99/stardust.svg?style=for-the-badge
[license-url]: https://github.com/vrag99/stardust/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/image.png
[frost-screenshot]: images/frost.png
[architecture]: images/architecture.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com