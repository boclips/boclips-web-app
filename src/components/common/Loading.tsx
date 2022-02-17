import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

export const Loading = () => (
  <h3 className="flex justify-center mt-16 text-lg">
    <LoadingOutlined className="mr-2" />
    {/*  @ts-ignore */}
    <span style={{ fontWeight: '500' }}>Loading</span>
  </h3>
);
