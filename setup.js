const { exec } = require('child_process');

const commands = [
  'npm install',
  'npm install ethers@5.6.1 --save',
  'npm install react-router-dom --save',
  'npm install flowbite flowbite-react',
  'npm install -D postcss autoprefixer',
  'npm i dotenv',
  'npm install axios'
];

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`, stderr);
        reject(error);
      } else {
        console.log(`Command executed successfully: ${command}`, stdout);
        resolve();
      }
    });
  });
};

const setupProject = async () => {
  try {
    for (const command of commands) {
      await executeCommand(command);
    }
    console.log('All commands executed successfully. Project setup is complete.');
  } catch (error) {
    console.error('Error setting up the project:', error);
  }
};

setupProject();
