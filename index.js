const { app, Tray, Menu, Notification } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let tray = null;
let taskPID = null;  
const taskName = 'FiveM.exe';  
let status = false;
const type = 'Moto';

app.on('ready', async () => {
    tray = new Tray(path.join(__dirname, 'icon.png'));  

    const contextMenu = Menu.buildFromTemplate([
        { label: `Fivem - ${status === true ? 'Ruleaza' : 'nu ruleaza'}`, type: 'normal', click: () => {} },
        { type: 'separator' },
        { label: 'Inchide', type: 'normal', click: () => { app.quit(); } }
    ]);

    tray.setToolTip('FiveM evidente PD');
    tray.setContextMenu(contextMenu);

    async function monitorTask() {
        exec('tasklist', (err, stdout, stderr) => {
            if (err) {
                console.error('Failed to retrieve task list:', err);
                return;
            }

            const processes = stdout.split('\n');
            const isTaskRunning = processes.some(line => line.includes(taskName));

            if (taskPID === null) {
                if (isTaskRunning) {
                    taskPID = Math.random(); 
                    status = true;
                    tray.setToolTip(`${taskName} merge.`);
                    new Notification({
                        title: 'Evidenta PD',
                        body: `${taskName} ruleaza.`,
                        silent: true,
                    }).show();
                }
            } else {
                if (!isTaskRunning) {
                    new Notification({
                        title: 'Evidenta PD',
                        body: `Sterge evidenta ${type}`,
                        silent: false,
                    }).show();

                    tray.setToolTip(`${taskName} oprit!`);
                    taskPID = null; 
                    status = false;
                } else {
                    tray.setToolTip(`${taskName} merge.`);
                }
            }
        });
    }

    setInterval(monitorTask, 10000);
});

app.on('window-all-closed', (e) => {
    e.preventDefault();  
});
