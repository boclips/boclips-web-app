import React from 'react';
import { render } from '@testing-library/react';
import { DisciplineHeader } from '@components/filterPanel/filter/disciplineSubjectFilter/DisciplineHeader';

describe('DisciplineHeader', () => {
  it('displays the number of selected subjects if greater than 0', () => {
    const wrapper = render(
      <DisciplineHeader
        isOpen={false}
        name="History"
        onClick={null}
        selectedSubjects={3}
      />,
    );

    const disciplineHeaderButton = wrapper.getByRole('button', {
      name: 'History',
    });
    expect(disciplineHeaderButton).toBeVisible();

    const bubble = wrapper.getByLabelText('3 subjects selected under History');
    expect(bubble).toBeVisible();
  });

  it('if only 1 subject selected, do not use plural in the label', () => {
    const wrapper = render(
      <DisciplineHeader
        isOpen={false}
        name="History"
        onClick={null}
        selectedSubjects={1}
      />,
    );

    const disciplineHeaderButton = wrapper.getByRole('button', {
      name: 'History',
    });
    expect(disciplineHeaderButton).toBeVisible();

    const bubble = wrapper.getByLabelText('1 subject selected under History');
    expect(bubble).toBeVisible();
  });

  it('does not display bubble when selected subjects is zero', () => {
    const wrapper = render(
      <DisciplineHeader
        isOpen={false}
        name="History"
        onClick={null}
        selectedSubjects={0}
      />,
    );

    const disciplineHeaderButton = wrapper.getByRole('button', {
      name: 'History',
    });
    expect(disciplineHeaderButton).toBeVisible();

    expect(wrapper.getByText('History')).toBeVisible();
    expect(wrapper.queryByText('History0')).toBeNull();
  });
});
