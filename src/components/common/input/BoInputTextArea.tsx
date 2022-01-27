import { Input } from 'antd';
import React from 'react';
import { TextAreaProps } from 'antd/lib/input/TextArea';
import s from './style.module.less';

interface Props extends TextAreaProps {
  dataQa?: string;
  rows?: number;
  placeholder?: string;
}

export const BoInputTextArea = ({
  dataQa,
  rows = 3,
  placeholder = '',
  ...others
}: Props) => {
  return (
    <div className={s.input}>
      <Input.TextArea
        autoSize={{ maxRows: rows + 2, minRows: rows }}
        style={{ paddingTop: '12px', paddingBottom: '12px' }}
        data-qa={dataQa}
        placeholder={placeholder}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...others}
      />
    </div>
  );
};
