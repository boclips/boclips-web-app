import { LoadingOutlined } from '@ant-design/icons';
import { Typography } from '@boclips-ui/typography';
import React from 'react';

export const Loading = () => (
  <Typography.H1 size="xs" className="flex justify-center mt-16">
    <LoadingOutlined className="mr-2" />
    <span>Loading</span>
  </Typography.H1>
);
