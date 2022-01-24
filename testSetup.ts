import '@testing-library/jest-dom/extend-expect';
import * as ReactTestingLibrary from '@testing-library/react';

const jestTimeout = 10000;

ReactTestingLibrary.configure({
    testIdAttribute: 'data-qa',
    asyncUtilTimeout: jestTimeout - 2000,
});

jest.setTimeout(jestTimeout);

window.scrollTo = jest.fn();
// @ts-ignore
window.matchMedia = window.matchMedia ||
    function () {
        return {
            matches: false,
            addListener() {
            },
            removeListener() {
            },
        };
    };

window.Appcues = {
    page: jest.fn(),
    identify: jest.fn(),
    track: jest.fn(),
}
