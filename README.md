# SibutMC-WebAPI
 
### How to run Sibut-WebAPI locally
- Install <a href="https://nodejs.org/dist/v18.16.1/node-v18.16.1-x64.msi" target="_blank">Node.js</a> LTS (Currently used v18.12.1)
- Download source code <a href="https://github.com/Darwinsuuu/SibutMC-WebAPI" target="_blank">here</a>
- After download, go to Visual Studio Code. Click File, then open folder. Find and choose SibutMC-WebAPI folder
- Create a new terminal in your VS Code or press Crtl + Shift + ` and type "npm i" to install all required dependencies
- While downloading/installing dependencies, download XAMPP <a href="https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.0.28/xampp-windows-x64-8.0.28-0-VS16-installer.exe" target="_blank">here</a>
- After install XAMPP and start 'Apache' & 'MySQL' in XAMPP Control Panel
- Click Admin in MySQL in Control Panel and create database named 'sibutmc_db'
- Go back to Visual Studio Code and enter 'npm install -g sequelize-cli'
- After installing sequelize-cli, run 'sequelize db:migrate'
- Lastly, type "npm start" in your terminal
  

### How to run in Internet
- Go to official website <a href="https://barangaymedicalcenter.com" target="_blank">barangaymedicalcenter.com</a>
