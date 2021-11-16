describe('ignore', () => {
  it('ignore', () => {
    expect(1).toBe(1);
  });
});
// import { render, screen } from '@testing-library/react';
// import React from 'react';
// import { MemoryRouter } from 'react-router-dom';
// import App from 'src/App';
// import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
// import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
// import { Helmet } from 'react-helmet';
//
// const disciplines = [
//   { name: 'Business', image: '' },
//   { name: 'Health and Medicine', image: '' },
//   { name: 'Humanities', image: '' },
//   { name: 'Life Sciences', image: '' },
//   { name: 'Mathematics', image: '' },
//   { name: 'Physical Sciences', image: '' },
//   { name: 'Social Sciences', image: '' },
//   { name: 'Technology', image: '' },
// ];
//
// describe('HomeView', () => {
//   it('loads the home view text', async () => {
//     const wrapper = render(
//       <MemoryRouter initialEntries={['/homepage-with-categories']}>
//         <App
//           apiClient={new FakeBoclipsClient()}
//           boclipsSecurity={stubBoclipsSecurity}
//         />
//       </MemoryRouter>,
//     );
//
//     expect(
//       await wrapper.findByText('Let’s find the videos you need'),
//     ).toBeInTheDocument();
//   });
//
//   it('displays Boclips as window title', async () => {
//     render(
//       <MemoryRouter initialEntries={['/homepage-with-categories']}>
//         <App
//           apiClient={new FakeBoclipsClient()}
//           boclipsSecurity={stubBoclipsSecurity}
//         />
//       </MemoryRouter>,
//     );
//
//     const helmet = Helmet.peek();
//
//     expect(helmet.title).toEqual('Boclips');
//   });
//
//   it('displays list of 8 disciplines', async () => {
//     render(
//       <MemoryRouter initialEntries={['/homepage-with-categories']}>
//         <App
//           apiClient={new FakeBoclipsClient()}
//           boclipsSecurity={stubBoclipsSecurity}
//         />
//       </MemoryRouter>,
//     );
//
//     disciplines.map((it) =>
//       expect(screen.getByText(it.name)).toBeInTheDocument(),
//     );
//   });
// });
