import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';

interface Props {
  bookTitle: string;
}

export const OpenstaxBookHeader = ({ bookTitle }: Props) => {
  return (
    <div className="col-start-8 col-end-26">
      <PageHeader title={bookTitle} />
    </div>
  );
};
