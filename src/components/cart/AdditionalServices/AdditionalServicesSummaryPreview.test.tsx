import React from 'react';
import { render } from '@testing-library/react';
import { AdditionalServicesSummaryPreview } from '@components/cart/AdditionalServices/AdditionalServicesSummaryPreview';

describe('additional services summary preview', () => {
  it('should display all additional services', async () => {
    const captionsAndTranscriptsRequested = true;
    const trim = '00:12 - 00:32';
    const editRequest = 'this is edit request';

    const wrapper = render(
      <AdditionalServicesSummaryPreview
        captionsAndTranscriptsRequested={captionsAndTranscriptsRequested}
        trim={trim}
        editRequest={editRequest}
        fontSize="small"
      />,
    );

    expect(
      await wrapper.findByText('English captions and transcripts requested'),
    ).toBeInTheDocument();
    expect(await wrapper.findByText('Trim: 00:12 - 00:32')).toBeInTheDocument();
    expect(
      await wrapper.findByText('Other type of editing: this is edit request'),
    ).toBeInTheDocument();
    expect(wrapper.queryByText('Free')).toBeNull();
  });
});
