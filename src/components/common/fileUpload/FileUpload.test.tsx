import { render } from '@testing-library/react';
import React from 'react';
import { FileUpload } from "src/components/common/fileUpload/FileUpload";

describe('File Upload Component', () => {
  it('can render the component', () => {
    const fileUpload = render(<FileUpload />);

    expect(fileUpload).toBeDefined();
  });
});
