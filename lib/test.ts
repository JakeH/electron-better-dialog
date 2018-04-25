import test from 'ava';
import * as mockRequire from 'mock-require';
import { MessageBoxOptions, BrowserWindow } from 'electron';

const testContext = {
    captured: {
        window: null,
        callback: null,
        options: <MessageBoxOptions>{},
        wasCalled: false,
    },
    behavior: {
        clickIndex: 0,
    }
};

const mockedElectron = {
    reset() {
        testContext.captured = {
            window: null,
            callback: null,
            options: <MessageBoxOptions>{},
            wasCalled: false,
        };
        testContext.behavior = {
            clickIndex: 0,
        };
    },
    app: {
        isReady: () => true
    },
    dialog: {
        showMessageBox(window, options, callback) {
            testContext.captured = {
                window,
                options,
                callback,
                wasCalled: true
            };

            if (callback) {
                callback(testContext.behavior.clickIndex);
            } else {
                return testContext.behavior.clickIndex;
            }
        }
    }
};

mockRequire('electron', mockedElectron);

// mock before importing
import { showBetterMessageBox, MessageBoxButton } from './index';

test.beforeEach('reset', t => {
    mockedElectron.reset();
    t.falsy(testContext.captured.wasCalled, 'Captured data cleared');
});

test('Electron is being passed an appropriate button labels', t => {

    const betterButtons: MessageBoxButton[] = [{
        label: 'First'
    }, {
        label: 'Second'
    }, {
        label: 'Third'
    }];

    showBetterMessageBox(null, {
        message: 'Test',
        betterButtons
    }, null);

    t.truthy(testContext.captured, 'Captured data exists');

    // ensure the buttons in the passed in options contains out labels, in proper order
    t.deepEqual(testContext.captured.options.buttons, betterButtons.map(b => b.label), 'Labels');

});

test('Window property is passed', t => {

    const window = new Object();
    window.constructor = BrowserWindow;

    const betterButtons: MessageBoxButton[] = [{
        label: 'First'
    }];

    showBetterMessageBox(<any>window, {
        message: 'Test',
        betterButtons
    }, null);

    t.truthy(testContext.captured, 'Captured data exists');

    t.is(testContext.captured.window, window, 'Window argument');

});

test('Window property is optional', t => {

    const betterButtons: MessageBoxButton[] = [{
        label: 'First'
    }];

    showBetterMessageBox(null, {
        message: 'Test',
        betterButtons
    }, null);

    t.truthy(testContext.captured, 'Captured data exists');

    t.falsy(testContext.captured.window, 'Window argument');

});

test('Callback is passed', t => {

    const callback = () => { t.pass('Callback called'); };

    const betterButtons: MessageBoxButton[] = [{
        label: 'First'
    }];

    showBetterMessageBox(null, {
        message: 'Test',
        betterButtons
    }, callback);

    t.truthy(testContext.captured, 'Captured data exists');

    t.truthy(testContext.captured.callback, 'Callback exists');

    testContext.captured.callback();

});

test('Callback is optional', t => {

    const betterButtons: MessageBoxButton[] = [{
        label: 'First'
    }];

    showBetterMessageBox(null, {
        message: 'Test',
        betterButtons
    });

    t.truthy(testContext.captured, 'Captured data exists');

    t.falsy(testContext.captured.callback, 'Callback argument');

});

test('Sync call returns button', t => {

    const betterButtons: MessageBoxButton[] = [{
        label: 'First',
        data: {
            date: +new Date()
        }
    }, {
        label: 'Second',
        data: {
            date: +new Date()
        }
    }];

    testContext.behavior.clickIndex = 1;

    const response = showBetterMessageBox(null, {
        message: 'Test',
        betterButtons
    });

    t.truthy(response, 'Captured data exists');

    t.is(response, betterButtons[1], 'Appropriate button returned');

});

test('Async call resolves with button', t => {

    const betterButtons: MessageBoxButton[] = [{
        label: 'First',
        data: {
            date: +new Date()
        }
    }, {
        label: 'Second',
        data: {
            date: +new Date()
        }
    }];

    testContext.behavior.clickIndex = 0;

    showBetterMessageBox(null, {
        message: 'Test',
        betterButtons
    }, response => {
        t.truthy(response, 'Captured data exists');
        t.is(response, betterButtons[0], 'Appropriate button returned');
    });

});

test('Default and Cancel ids are correct', t => {

    const betterButtons: MessageBoxButton[] = [{
        label: 'Default',
        isDefault: true
    }, {
        label: 'Cancel',
        isCancel: true
    }, {
        label: 'Regular'
    }];

    showBetterMessageBox(null, {
        message: 'Test',
        betterButtons
    }, response => {
        t.truthy(response, 'Captured data exists');

        t.is(0, testContext.captured.options.defaultId, 'Default id');
        t.is(1, testContext.captured.options.cancelId, 'Cancel id');

    });

});
