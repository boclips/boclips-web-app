import { render } from '@testing-library/react';
import React, { ReactElement } from 'react';
import AppInitializer from 'src/index';
import MockedBoclipsSecurity from 'boclips-js-security';

jest.mock('boclips-js-security', () => ({
  __esModule: true,
  default: {
    createInstance: jest.fn(),
  },
}));

jest.mock('./thirdParty/loadHotjar.js', () => null);
jest.mock('./thirdParty/loadPendo.js', () => null);

const renderAppInitializer = (viewMock?: ReactElement) => {
  return render(<AppInitializer viewMock={viewMock} />);
};

describe('AppInitializer', () => {
  it('renders AppUnauthenticated for /register path', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL('http://localhost/register');

    const wrapper = renderAppInitializer(<div>Unauthenticated App</div>);

    expect(wrapper.getByText('Unauthenticated App')).toBeInTheDocument();
  });

  it('renders AppUnauthenticated for /classroom/register path', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL('http://localhost/classroom/register');

    const wrapper = renderAppInitializer(<div>Unauthenticated App</div>);

    expect(wrapper.getByText('Unauthenticated App')).toBeInTheDocument();
  });

  it('renders AppUnauthenticated for /videos/shared path', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL(
      'http://localhost/videos/shared/5c542ab85438cdbcb56ddce2?referer=42b090f3-5a32-43d7-8faf-38bca304ca94',
    );

    const wrapper = renderAppInitializer(<div>Unauthenticated App</div>);

    expect(wrapper.getByText('Unauthenticated App')).toBeInTheDocument();
  });

  it('renders AppUnauthenticated for /playlists/shared path', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL(
      'http://localhost/playlists/shared/5c542ab85438cdbcb56ddce2?referer=42b090f3-5a32-43d7-8faf-38bca304ca94',
    );

    const wrapper = renderAppInitializer(<div>Unauthenticated App</div>);

    expect(wrapper.getByText('Unauthenticated App')).toBeInTheDocument();
  });

  it('renders authorized app', () => {
    delete window.location;
    // @ts-ignore
    window.location = new URL(
      'http://localhost/videos/5c542ab85438cdbcb56ddce2',
    );

    renderAppInitializer();

    expect(MockedBoclipsSecurity.createInstance).toHaveBeenCalled();
  });
});
