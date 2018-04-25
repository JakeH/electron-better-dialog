import { app, BrowserWindow } from 'electron';
import { showBetterMessageBox } from '../index';

let mainWindow: Electron.BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function syncDemo() {
    // sync call
    const syncResponse = showBetterMessageBox(mainWindow, {
        message: 'Sync',
        betterButtons: [
            {
                label: 'Default Button',
                isDefault: true
            }, {
                label: 'Cancel Button',
                isCancel: true
            }
        ]
    });

    if (syncResponse.isDefault) {
        console.dir('Default button clicked.');
    } else if (syncResponse.isCancel) {
        console.dir('Cancel button clicked.');
    }
}

function asyncDemo() {
    // async call
    showBetterMessageBox(mainWindow, {
        message: 'Async',
        betterButtons: [
            {
                label: 'Default Button',
                isDefault: true
            }, {
                label: 'Cancel Button',
                isCancel: true
            }, {
                label: 'Action Button',
                data: {
                    arbitrary: true
                },
                action() {
                    console.dir(`Button '${this.label}' clicked. Data: ${JSON.stringify(this.data)}`);
                }
            }
        ]
    }, response => {
        if (response.action) {
            response.action();
        }
        if (response.isDefault) {
            console.dir('Default button clicked.');
        } else if (response.isCancel) {
            console.dir('Cancel button clicked.');
        }
    });
}

app.on('ready', () => {
    createWindow();

    syncDemo();
    asyncDemo();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
