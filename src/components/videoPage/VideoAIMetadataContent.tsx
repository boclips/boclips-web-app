import { LoadingOutlined } from '@ant-design/icons';
import s from 'src/components/videoPage/style.module.less';
import Badge from '@boclips-ui/badge';
import { Typography } from '@boclips-ui/typography';
import React from 'react';

interface Props {
  isLoading: boolean;
  metadata?: string[];
  type: string;
}
export const VideoAIMetadataContent = ({
  isLoading,
  metadata,
  type,
}: Props) => {
  const getAIBadge = () =>
    isLoading ? (
      <LoadingOutlined className={s.spinner} />
    ) : (
      <Badge value="AI generated" />
    );

  const showContent = () => (
    <ul className={s.outcomeList}>
      {metadata.map((elem: string) => (
        <Typography.Body as="li" size="small" className="text-gray-800">
          {elem}
        </Typography.Body>
      ))}
    </ul>
  );

  const showErrorMessage = () => (
    <Typography.Body as="p" size="small" className="text-gray-800">
      No {type} found.
    </Typography.Body>
  );

  const content = metadata ? showContent() : showErrorMessage();
  return (
    <div className={s.videoAIContent}>
      <div className="flex flex-row items-center">
        <Typography.Title1 className="mr-2">{type}</Typography.Title1>
        {getAIBadge()}
      </div>
      {!isLoading ? content : null}
    </div>
  );
};
