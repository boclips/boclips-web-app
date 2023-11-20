import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import c from 'classnames';
import { Typography } from '@boclips-ui/typography';
import { VideoLicensingDetail } from 'src/components/videoPage/videoLicensingDetails/VideoLicensingDetail';
import { getVideoPageLicenseDurationLabel } from 'src/services/getVideoLicenseDurationLabel';
import { EditingRestrictionsLabel } from 'src/components/videoPage/videoLicensingDetails/EditingRestrictionsLabel';
import { TerritoryRestrictionsLabel } from 'src/components/videoPage/videoLicensingDetails/TerritoryRestrictionsLabel';
import { VideoRestrictionsLabel } from 'src/components/videoPage/videoLicensingDetails/VideoRestrictionsLabel';
import s from './videoLicensingDetails.module.less';

interface Props {
  video: Video;
}

export const VideoLicensingDetails = ({ video }: Props) => {
  const showVideoRestrictions = video.restrictions?.video;
  const showTerritoryRestrictions =
    video.restrictions?.territory?.type === 'RESTRICTED' &&
    video.restrictions?.territory?.territories &&
    video.restrictions?.territory?.territories.length > 0;

  return (
    <section className={c(s.scrollableLicensingDetails)}>
      <Typography.H1 size="xs" weight="medium" className="text-gray-900">
        Licensing Details
      </Typography.H1>
      <div className="mb-4">
        <Typography.Body size="small" className="text-gray-700">
          See our{' '}
          <a
            rel="noopener noreferrer"
            href="https://boclips.com/boclips-faq#licensing-and-editing"
            target="_blank"
          >
            <Typography.Body size="small">
              <Typography.Link type="inline-blue">
                Licensing Details FAQs
              </Typography.Link>
            </Typography.Body>
          </a>{' '}
          for more details
        </Typography.Body>
      </div>

      <div className="flex flex-col mt-2">
        <VideoLicensingDetail
          title="Maximum Licensing Term"
          value={getVideoPageLicenseDurationLabel(
            video.maxLicenseDurationYears,
          )}
        />

        {showTerritoryRestrictions && (
          <VideoLicensingDetail
            title="Territory restrictions"
            value={
              <TerritoryRestrictionsLabel
                territories={video.restrictions.territory.territories}
              />
            }
          />
        )}

        {video.restrictions?.editing?.permission && (
          <VideoLicensingDetail
            title="Editing restrictions"
            value={
              <EditingRestrictionsLabel
                permission={video.restrictions.editing.permission}
              />
            }
          />
        )}
        {showVideoRestrictions && (
          <VideoLicensingDetail
            title="Video restrictions"
            value={
              <VideoRestrictionsLabel restrictions={video.restrictions.video} />
            }
          />
        )}
      </div>
    </section>
  );
};
