import React from 'react';
import { FilterOption } from '@src/types/FilterOption';

export class FilterOptionFactory {
  static sample(option: Partial<FilterOption>): FilterOption {
    return {
      id: 'id',
      name: 'My filter',
      label: <span>My filter label</span>,
      hits: 12,
      key: 'channel',
      ...option,
    };
  }
}
