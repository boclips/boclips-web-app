import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DisciplineWidget from 'src/components/disciplinesWidget/DisciplinesWidget';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import userEvent from '@testing-library/user-event';

export const disciplines = [
  {
    id: '1',
    name: 'Business',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences',
      },
      {
        id: 'id-3',
        name: 'General Biology',
      },
      {
        id: '4',
        name: 'Human Biology',
      },
      {
        id: '5',
        name: 'Microbiology',
      },
    ],
  },
  {
    id: '2',
    name: 'Health and Medicine',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry 1',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies 1',
      },
      {
        id: 'id-3',
        name: 'General Biology 1',
      },
      {
        id: '4',
        name: 'Human Biology 1',
      },
      {
        id: '5',
        name: 'Microbiology 1',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences 1',
      },
    ],
  },
  {
    id: '3',
    name: 'Humanities',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry 1',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies 1',
      },
      {
        id: 'id-3',
        name: 'General Biology 1',
      },
      {
        id: '4',
        name: 'Human Biology 1',
      },
      {
        id: '5',
        name: 'Microbiology 1',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences 1',
      },
    ],
  },
  {
    id: '4',
    name: 'Life Sciences',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry 1',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies 1',
      },
      {
        id: 'id-3',
        name: 'General Biology 1',
      },
      {
        id: '4',
        name: 'Human Biology 1',
      },
      {
        id: '5',
        name: 'Microbiology 1',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences 1',
      },
    ],
  },
  {
    id: '5',
    name: 'Mathematics',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies',
      },
      {
        id: 'id-3',
        name: 'General Biology',
      },
      {
        id: '4',
        name: 'Human Biology',
      },
      {
        id: '5',
        name: 'Microbiology',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences',
      },
    ],
  },
  {
    id: '6',
    name: 'Physical Sciences',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry 1',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies 1',
      },
      {
        id: 'id-3',
        name: 'General Biology 1',
      },
      {
        id: '4',
        name: 'Human Biology 1',
      },
      {
        id: '5',
        name: 'Microbiology 1',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences 1',
      },
    ],
  },
  {
    id: '8',
    name: 'Technology',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry 1',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies 1',
      },
      {
        id: 'id-3',
        name: 'General Biology 1',
      },
      {
        id: '4',
        name: 'Human Biology 1',
      },
      {
        id: '5',
        name: 'Microbiology 1',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences 1',
      },
    ],
  },
  {
    id: '7',
    name: 'Social Sciences',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry 1',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies 1',
      },
      {
        id: 'id-3',
        name: 'General Biology 1',
      },
      {
        id: '4',
        name: 'Human Biology 1',
      },
      {
        id: '5',
        name: 'Microbiology 1',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences 1',
      },
    ],
  },
  {
    id: '',
    name: 'World Languages',
    code: 'discipline-code',
    subjects: [
      {
        id: '5cb499c9fd5beb428189454f',
        name: 'Biochemistry 1',
      },
      {
        id: 'id-2',
        name: 'Ecology and Environmental Studies 1',
      },
      {
        id: 'id-3',
        name: 'General Biology 1',
      },
      {
        id: '4',
        name: 'Human Biology 1',
      },
      {
        id: '5',
        name: 'Microbiology 1',
      },
      {
        id: '6',
        name: 'Zoology and Animal Sciences 1',
      },
    ],
  },
];

describe('Mobile & Desktop - DisciplineWidget', () => {
  it('displays list of 8 disciplines', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertDiscipline(discipline);
    });

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={['/homepage-with-categories']}>
            <DisciplineWidget />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    const buttons = await wrapper.findAllByRole('button');
    expect(buttons.length).toBe(8);

    const orderedButtonLabels = [
      'Business',
      'Health and Medicine',
      'Humanities',
      'Life Sciences',
      'Mathematics',
      'Physical Sciences',
      'Social Sciences',
      'Technology',
    ];
    orderedButtonLabels.forEach((label, index) =>
      expect(buttons[index].textContent).toBe(label),
    );

    expect(await screen.findByText(disciplines[0].name)).toBeInTheDocument();
    expect(await screen.findByText(disciplines[1].name)).toBeInTheDocument();
    expect(await screen.findByText(disciplines[2].name)).toBeInTheDocument();
    expect(await screen.findByText(disciplines[3].name)).toBeInTheDocument();
    expect(await screen.findByText(disciplines[4].name)).toBeInTheDocument();
    expect(await screen.findByText(disciplines[5].name)).toBeInTheDocument();
    expect(await screen.findByText(disciplines[6].name)).toBeInTheDocument();
    expect(await screen.findByText(disciplines[7].name)).toBeInTheDocument();
    expect(screen.queryByText(disciplines[8].name)).not.toBeInTheDocument();
  });
});

describe('Mobile - DisciplineWidget ', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWeight', {
      writable: true,
      configurable: true,
      value: 375,
    });
  });

  it('displays full page overlay when discipline tapped', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={['/homepage-with-categories']}>
            <DisciplineWidget />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    fireEvent.click(await screen.findByText('Business'));

    expect(await screen.findByText('Select subject'));
    expect(await screen.findByTestId('discipline-title'));

    disciplines[0].subjects.map((it) =>
      expect(screen.getByText(it.name)).toBeInTheDocument(),
    );
  });

  it('overlay disappears when < is tapped', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={['/homepage-with-categories']}>
            <DisciplineWidget />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    fireEvent.click(await screen.findByText('Business'));

    fireEvent.click(await screen.findByTestId('overlay-header-back-button'));

    expect(await screen.queryByText('Select subject')).not.toBeInTheDocument();
  });

  it('displays full page overlay when discipline opened via keyboard (enter)', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    disciplines.forEach((discipline) => {
      fakeClient.disciplines.insertDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={['/homepage-with-categories']}>
            <DisciplineWidget />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    userEvent.type(
      await screen.findByRole('button', { name: /Business/ }),
      '{Enter}',
    );

    expect(await screen.findByText('Select subject'));
  });
});

describe('Desktop - DisciplineWidget', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1700,
    });
  });
  it('displays subject panel', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={['/homepage-with-categories']}>
            <DisciplineWidget />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    fireEvent.click(await screen.findByText('Business'));

    const renderedSubjects = await screen.findAllByRole('link');
    disciplines[0]?.subjects
      ?.sort((a, b) => a.name.localeCompare(b.name))
      .map((it, index) =>
        expect(renderedSubjects[index].textContent).toBe(it.name),
      );
  });
});
