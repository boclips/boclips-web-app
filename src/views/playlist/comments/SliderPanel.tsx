import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { useAddCommentToVideo } from 'src/hooks/api/playlistsQuery';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import React, { useRef, useState } from 'react';
import s from 'src/views/playlist/comments/style.module.less';
import { Typography } from '@boclips-ui/typography';
import Button from '@boclips-ui/button';
import CloseSVG from 'src/resources/icons/cross-icon.svg';
import { InputText } from '@boclips-ui/input';
import AccountSVG from 'src/resources/icons/account-icon.svg';
import { TextButton } from 'src/components/common/textButton/TextButton';
import ReplySVG from 'src/resources/icons/reply-icon.svg';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';

type Props = {
  closeSliderOnClick: () => void;
  videoId: string;
  comments?: Array<{
    id: string;
    name?: string;
    email: string;
    text: string;
    createdAt: string;
  }>;
  collection: Collection;
};

const SliderPanel = ({
  closeSliderOnClick,
  comments,
  videoId,
  collection,
}: Props) => {
  const { mutate: addCommentToVideo } = useAddCommentToVideo();
  const { data: user } = useGetUserQuery();
  const ref = useRef(null);

  CloseOnClickOutside(ref, () => closeSliderOnClick());

  const addComment = () => {
    addCommentToVideo({
      playlist: collection,
      request: {
        videoId,
        name: `${user.firstName} ${user.lastName} `,
        email: user.email,
        text: comment,
      },
    });
    setComment('');
  };

  const [comment, setComment] = useState<string>();

  return (
    <aside
      ref={ref}
      className={s.sliderPanel}
      data-qa={`slider-panel-${videoId}`}
    >
      <section className={s.header}>
        <Typography.Body className={s.headerText} weight="medium">
          Comments
        </Typography.Body>
        <Button
          onClick={closeSliderOnClick}
          icon={<CloseSVG />}
          iconOnly
          type="outline"
          height="24px"
          width="24px"
          data-qa="close-button"
        />
      </section>
      <section className={s.input}>
        <Typography.Body className={s.headerText} weight="medium">
          {collection.videos.find((it) => it.id === videoId)?.title}
        </Typography.Body>
        <InputText
          id={videoId}
          inputType="textarea"
          onChange={(text) => setComment(text)}
          placeholder="Add a comment"
        />
      </section>
      <section className={s.body}>
        {comments.map((it) => {
          return (
            <div className={s.comment}>
              <div className={s.name}>
                <AccountSVG />
                <Typography.Body as="span" size="small" weight="medium">
                  {it.name}
                </Typography.Body>
              </div>
              <div className={s.date}>
                <Typography.Body as="span" size="small">
                  {it.createdAt}
                </Typography.Body>
              </div>
              <div>
                <Typography.Body>{it.text}</Typography.Body>
              </div>
            </div>
          );
        })}
      </section>
      <section className={s.footer}>
        <TextButton
          onClick={() => addComment()}
          icon={<ReplySVG />}
          text="Reply"
        />
      </section>
    </aside>
  );
};

export default SliderPanel;
