import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from 'src/App';
import { MemoryRouter } from 'react-router-dom';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsSecurity } from 'boclips-js-security/dist/BoclipsSecurity';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

expect.extend(toHaveNoViolations);

it('should demonstrate this matcher`s usage with react testing library', async () => {
  const security: BoclipsSecurity = {
    ...stubBoclipsSecurity,
    hasRole: (_) => false,
  };

  const { container } = render(
    <MemoryRouter>
      <App boclipsSecurity={security} apiClient={new FakeBoclipsClient()} />,
    </MemoryRouter>,
  );
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
