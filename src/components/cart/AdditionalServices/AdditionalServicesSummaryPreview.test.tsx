import React from 'react';
import { render } from '@testing-library/react';
import { AdditionalServicesSummaryPreview } from 'src/components/cart/AdditionalServices/AdditionalServicesSummaryPreview';

describe('additional services summary preview', () => {
  it('should display all additional services', async () => {
    const captionsRequested = true;
    const transcriptRequested = true;
    const trim = '00:12 - 00:32';
    const editRequest = 'this is edit request';

    const wrapper = render(
      <AdditionalServicesSummaryPreview
        captionsRequested={captionsRequested}
        transcriptRequested={transcriptRequested}
        trim={trim}
        editRequest={editRequest}
        fontSize="small"
        displayPrice
      />,
    );

    expect(
      await wrapper.findByText('English captions requested'),
    ).toBeInTheDocument();
    expect(
      await wrapper.findByText('Transcripts requested'),
    ).toBeInTheDocument();
    expect(await wrapper.findByText('Trim: 00:12 - 00:32')).toBeInTheDocument();
    expect(
      await wrapper.findByText('Other type of editing: this is edit request'),
    ).toBeInTheDocument();
  });
});
