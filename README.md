[![Build Status](https://travis-ci.org/JakeH/electron-better-dialog.svg?branch=master)](https://travis-ci.org/JakeH/electron-better-dialog) [![Coverage Status](https://coveralls.io/repos/github/JakeH/electron-better-dialog/badge.svg?branch=master)](https://coveralls.io/github/JakeH/electron-better-dialog?branch=master)
# electron-better-dialog
> Wrapper for the Electron `showMessageBox` function which works with button objects instead of indexes.

This was created to allow for dynamically created buttons without the worry of indexes, as well as to allow the buttons themselves to define the action they should invoke when clicked.

### Vanilla Electron Dialog
```typescript
dialog.showMessageBox(mainWindow, {
    message: 'Vanilla',
    buttons: ['Default Button', 'Cancel Button'],
    defaultId: 0, // bound to buttons array
    cancelId: 1 // bound to buttons array 
}, response => {
    if (response === 0) { // bound to buttons array
        console.dir('Default button clicked.');
    } else if (response === 1) { // bound to buttons array
        console.dir('Cancel button clicked.');
    }
});
```
Changing the order of the `buttons` array would also require a change of `defaultId`, `cancelId` and the `callback` body.

### electron-bettter-dialog
```typescript
showBetterMessageBox(mainWindow, {
    message: 'Better',
    betterButtons: [
        {
            label: 'Default Button',
            isDefault: true
        }, {
            label: 'Cancel Button',
            isCancel: true
        }
    ]
}, response => {
    if (response.isDefault) {
        console.dir('Default button clicked.');
    } else if (response.isCancel) {
        console.dir('Cancel button clicked.');
    }
});
```
Changing the order of the buttons has no effect on other code. 

## Install
```sh
$ npm install electron-better-dialog --save
```

## Usage

### Synchronous Dialog

```typescript
import { showBetterMessageBox } from 'electron-better-dialog';

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
```

### Asynchronous Dialog

```typescript
import { showBetterMessageBox } from 'electron-better-dialog';

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
```

## API

### `showBetterDialog([browserWindow, ]options[, callback])`

* `browserWindow` [BrowserWindow](https://github.com/electron/electron/tree/master/docs/api/browser-window.md) (optional)
* `options` [BetterMessageBoxOptions](#bettermessageboxoptions)
* `callback` Function (optional)
  * `response` [MessageBoxButton](#messageboxbutton) - The instance of the button that was selected.
  * `checkboxChecked` Boolean - The checked state of the checkbox if `checkboxLabel` was set. Otherwise `false`.
  
Shows a message box. 

The `browserWindow` argument allows the dialog to attach itself to a parent window, making it modal.

When a callback is provided:
* Dialog will be shown asynchronously.
* Function will return void.
* Callback will be called with the instance of the selected [MessageBoxButton](#messageboxbutton).

When a callback is not provided:
* Dialog will be shown synchronously, blocking the process.
* Function will return the instance of the selected [MessageBoxButton](#messageboxbutton).


### `MessageBoxButton`

* `label` String - Button display label.
* `action` Function (optional) - Optional function to attach to the button.
* `isDefault` Boolean (optional) - True if the button should be selected by default when the message box opens.
* `isCancel` Boolean (optional) - If true, this button will be selected when the message box is canceled via the Esc key.
* `data` Object (optional) - Optional data to attach to the button.

### `BetterMessageBoxOptions`
> Extends Electron's [showMessageBox](https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowmessageboxbrowserwindow-options-callback) options.

* `betterButtons` [MessageBoxButton](#messageboxbutton)[] - Array of buttons to display.
* `message` String - Content of the message box.
* `type` String (optional) - Can be `"none"`, `"info"`, `"error"`, `"question"` or `"warning"`. On Windows, `"question"` displays the same icon as `"info"`, unless you set an icon using the `"icon"` option. On macOS, both `"warning"` and `"error"` display the same warning icon.
* `defaultId` Integer (optional) - Index of the button in the buttons array which will be selected by default when the message box opens.
* `title` String (optional) - Title of the message box, some platforms will not show it.
* `detail` String (optional) - Extra information of the message.
* `checkboxLabel` String (optional) - If provided, the message box will include a checkbox with the given label. The checkbox state can be inspected only when using `callback`.
* `checkboxChecked` Boolean (optional) - Initial checked state of the checkbox. `false` by default.
* `icon` [NativeImage](https://github.com/electron/electron/tree/master/docs/api/native-image.md) (optional)
* `cancelId` Integer (optional) - The index of the button to be used to cancel the dialog, via the `Esc` key. By default this is assigned to the first button with "cancel" or "no" as the label. If no such labeled buttons exist and this option is not set, `0` will be used as the return value or callback response. This option is ignored on Windows.
* `noLink` Boolean (optional) - On Windows Electron will try to figure out which one of the `buttons` are common buttons (like "Cancel" or "Yes"), and show the others as command links in the dialog. This can make the dialog appear in the style of modern Windows apps. If you don't like this behavior, you can set `noLink` to `true`.
* `normalizeAccessKeys` Boolean (optional) - Normalize the keyboard access keys across platforms. Default is `false`. Enabling this assumes `&` is used in the button labels for the placement of the keyboard shortcut access key and labels will be converted so they work correctly on each platform, `&` characters are removed on macOS, converted to `_` on Linux, and left untouched on Windows. For example, a button label of `Vie&w` will be converted to `Vie_w` on Linux and `View` on macOS and can be selected via `Alt-W` on Windows and Linux.
