import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DisciplineWidget from 'src/components/disciplinesWidget/DisciplinesWidget';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import userEvent from '@testing-library/user-event';
import { disciplines } from './disciplinesFixture';

describe('Mobile & Desktop - DisciplineWidget', () => {
  it('displays list of 8 disciplines', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertMyDiscipline(discipline);
    });

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter>
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
      expect(buttons[index].textContent).toBe(`${label} discipline`),
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
    window.resizeTo(768, 1024);
  });

  it('displays full page overlay when discipline tapped', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertMyDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter>
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
      fakeClient.disciplines.insertMyDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter>
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
      fakeClient.disciplines.insertMyDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter>
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
    window.resizeTo(1680, 1024);
  });

  it('displays subject panel', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    // eslint-disable-next-line array-callback-return
    disciplines.map((discipline) => {
      fakeClient.disciplines.insertMyDiscipline(discipline);
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter>
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
        expect(renderedSubjects[index].textContent).toBe(`${it.name} subject`),
      );
  });

  it('displays a list of subjects that we also offer', async () => {
    const fakeClient = new FakeBoclipsClient();
    const client = new QueryClient();

    fakeClient.disciplines.insertDiscipline({
      id: '123',
      name: 'discipline name',
      code: 'discipline code',
      subjects: [
        { id: 'subject123', name: 'Available subject' },
        { id: 'subject456', name: 'Unavailable subject' },
      ],
    });

    fakeClient.disciplines.insertMyDiscipline({
      id: '123',
      name: 'discipline name',
      code: 'discipline code',
      subjects: [{ id: 'subject123', name: 'Available subject' }],
    });

    render(
      <BoclipsClientProvider client={fakeClient}>
        <QueryClientProvider client={client}>
          <MemoryRouter>
            <DisciplineWidget />
          </MemoryRouter>
        </QueryClientProvider>
      </BoclipsClientProvider>,
    );

    fireEvent.click(await screen.findByText('discipline name'));
    const renderedAvailableSubjects = await screen.findAllByRole('link');

    const availableSubject = screen.getByRole('link', {
      name: /Available subject/,
    });
    const subjectsWeAlsoOffer = screen.getByText('Unavailable subject');

    expect(availableSubject).toBeVisible();
    expect(subjectsWeAlsoOffer).toBeVisible();

    expect(renderedAvailableSubjects).not.toContain(subjectsWeAlsoOffer);
    expect(renderedAvailableSubjects).toContain(availableSubject);
  });
});
