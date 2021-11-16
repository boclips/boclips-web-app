import React from 'react';
import ImagePlaceholder from 'resources/placeholder/image.svg';
import ArrowRight from 'resources/icons/arrow-no-size.svg';
import s from './style.module.less';

const disciplines = [
  { name: 'Business', image: '' },
  { name: 'Health and Medicine', image: '' },
  { name: 'Humanities', image: '' },
  { name: 'Life Sciences', image: '' },
  { name: 'Mathematics', image: '' },
  { name: 'Physical Sciences', image: '' },
  { name: 'Social Sciences', image: '' },
  { name: 'Technology', image: '' },
];

const DisciplineWidget = () => {
  return (
    <main className="col-span-full row-start-2 row-end-2 px-4">
      <h4 className="text-center">Let’s find the videos you need</h4>
      <div className="mt-4">
        {disciplines.map((it) => {
          return (
            <button
              key={it.name}
              type="button"
              onClick={() => null}
              className={s.discipline}
            >
              <ImagePlaceholder />
              <span className="flex items-center font-medium w-full">
                {it.name}
              </span>
              <span className={s.arrow}>
                <ArrowRight />
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default DisciplineWidget;
