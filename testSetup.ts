import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import resizeTo from "src/testSupport/resizeTo";

const jestTimeout = 10000;

configure({
    testIdAttribute: 'data-qa',
    asyncUtilTimeout: jestTimeout - 2000,
});

jest.setTimeout(jestTimeout);

window.resizeTo = resizeTo;

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
