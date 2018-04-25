import { dialog, BrowserWindow, MessageBoxOptions } from 'electron';

export interface MessageBoxButton {
    /**
     * Button display label
     */
    label: string;

    /**
     * Optional function to attach to the button
     */
    action?: () => void;

    /**
     * True if the button should be selected by default when the message box opens
     */
    isDefault?: boolean;

    /**
     * If true, the button will be selected when the message box is canceled via the Esc key
     */
    isCancel?: boolean;

    /**
     * Optional data to attach to the button
     */
    data?: any;
}

/**
 * Better message box options
 */
export interface BetterMessageBoxOptions extends MessageBoxOptions {

    /**
     * Buttons to add to the message box
     */
    betterButtons: MessageBoxButton[];
}

/**
*  Shows a message box asynchronously and invokes the callback function with an instance of the button that was selected
* 
* @see Electron.Dialog.showMessageBox
* @param window The window to attach to as as modal dialog
* @param options The options
* @param callback Callback when button is selected 
*/
export function showBetterMessageBox(window: BrowserWindow, options: BetterMessageBoxOptions,
    callback: (response: MessageBoxButton, checkboxChecked: boolean) => void): void;

/**
 * Shows a message box asynchronously and invokes the callback function with an instance of the button that was selected
 * 
 * @param options The options
 * @param callback Callback when button is selected
 */
export function showBetterMessageBox(options: BetterMessageBoxOptions,
    callback: (response: MessageBoxButton, checkboxChecked: boolean) => void): void;

/**
* Shows a message box synchronously and returns an instance of the button that was selected
* 
* @param window The window to attach to as as modal dialog
* @param options The options
*/
export function showBetterMessageBox(window: BrowserWindow, options: BetterMessageBoxOptions): MessageBoxButton;

/**
* Shows a message box synchronously and returns an instance of the button that was selected
* 
* @param options The options
*/
export function showBetterMessageBox(options: BetterMessageBoxOptions): MessageBoxButton;

export function showBetterMessageBox(...args: any[]): MessageBoxButton | void {

    let [window, options, callback] = args;

    if (window != null && window.constructor !== BrowserWindow) {
        [window, options, callback] = [null, window, options];
    }

    return internalShowBetterMessageBox(window, options, callback);
}

function internalShowBetterMessageBox(window: BrowserWindow, options: BetterMessageBoxOptions,
    callback?: (response: MessageBoxButton, checkboxChecked: boolean) => void): MessageBoxButton | void {

    if (!(options.betterButtons && options.betterButtons.length)) {
        throw new Error('Use the betterButtons property with this function');
    }

    options.buttons = [];

    options.betterButtons.forEach((b, i) => {
        options.buttons.push(b.label);
        options.cancelId = b.isCancel ? i : options.cancelId;
        options.defaultId = b.isDefault ? i : options.defaultId;
    });

    if (callback) {
        dialog.showMessageBox(window, options, (res, check) => {
            callback(options.betterButtons[res], check);
        });
    } else {
        const result = dialog.showMessageBox(window, options);
        return options.betterButtons[result];
    }
}
