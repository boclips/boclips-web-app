import { Stats } from 'src/hooks/api/dashboard/Stats';
import { Typography } from '@boclips-ui/typography';
import c from 'classnames';
import s from 'src/components/dashboard/performance/dashboardPerformance.module.less';
import LightBulbIcon from 'src/resources/icons/light-bulb.svg';
import QuestionIcon from 'src/resources/icons/question.svg';
import React from 'react';

interface Props {
  statsData: Stats;
}
export const TopVideosBlock = ({ statsData }: Props) => {
  return (
    statsData && (
      <>
        <Typography.H1 size="sm">Your top 5 videos</Typography.H1>
        <table
          className={c(
            'mt-4 w-full h-full table-auto border-collapse',
            s.table,
          )}
        >
          <thead>
            <tr className="bg-blue-100 h-16">
              <th className="pl-6 text-left">Video title</th>
              <th className="text-left">Video ID</th>
              <th className="text-left">Views (Total)</th>
              <th className="text-left">
                <div
                  className={c(
                    'flex flex-row content-center items-center space-x-2',
                    s.ctrScore,
                  )}
                >
                  <div>CTR Score</div>
                  <QuestionIcon />
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {statsData &&
              statsData.mostPopularVideos.map((video) => (
                <tr className="border-t-2 border-blue-400">
                  <td className="pl-6">{video.videoTitle}</td>
                  <td className="">{video.videoId}</td>
                  <td className="">{video.views}</td>
                  <td className="">{video.ctrScore}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div
          className={c(
            'flex flex-row space-x-6 items-center mt-2 pl-6 box-content border-2 border-blue-400 rounded bg-blue-100',
            s.insightBox,
          )}
        >
          <LightBulbIcon />
          <div className="flex flex-col space-y-2">
            <Typography.Body className="text-gray-800 !font-medium">
              Would you like to improve your video distribution and
              click-through rate?
            </Typography.Body>
            <Typography.Body className="text-gray-800">
              Go to{' '}
              <Typography.Link className="!text-blue-800 !font-medium">
                Content Insights
              </Typography.Link>{' '}
              section and review our expert’s recommendations
            </Typography.Body>
          </div>
        </div>
      </>
    )
  );
};
