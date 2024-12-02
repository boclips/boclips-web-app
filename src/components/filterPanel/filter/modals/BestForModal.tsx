import { Bodal } from '@src/components/common/bodal/Bodal';
import { Typography } from 'boclips-ui';
import React from 'react';
import { bestForInfo } from '@src/resources/bestFor';
import s from './style.module.less';

const BestForModal = ({ setOpen }) => {
  return (
    <Bodal
      title="What are “Best for” tags?"
      onCancel={() => setOpen(false)}
      closeOnClickOutside
      displayCancelButton={false}
      confirmButtonText="OK, great!"
      onConfirm={() => setOpen(false)}
      dataQa="best-for-modal"
      smallSize={false}
    >
      <Typography.Body as="section" className={s.header}>
        Our tags are a suggested model for the typical pedagogical flow of a
        lesson plan.
      </Typography.Body>
      {bestForInfo.map((it) => {
        return (
          <section className={s.body}>
            <div className={s.title}>
              <Typography.Body weight="medium">{it.title}</Typography.Body>
              <div className={s.icon}>{it.icon}</div>
            </div>
            <Typography.Body>{it.description}</Typography.Body>
          </section>
        );
      })}
    </Bodal>
  );
};

export default BestForModal;
