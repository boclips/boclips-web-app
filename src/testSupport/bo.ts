import { FakeVideosClient } from 'boclips-api-client/dist/sub-clients/videos/client/FakeVideosClient';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';
import {
  FacetFactory,
  FacetsFactory,
} from 'boclips-api-client/dist/test-support/FacetsFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import {
  FakeBoclipsClient,
  SubjectFactory,
} from 'boclips-api-client/dist/test-support';
import { VideoFacets } from 'boclips-api-client/dist/sub-clients/videos/model/VideoFacets';
import { Subject } from 'boclips-api-client/dist/sub-clients/subjects/model/Subject';
import { UserFeatureKey } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';

export interface Bo {
  interact(callback: (apiClient: FakeBoclipsClient) => void): void;

  create: {
    fixtureSet: {
      eelsBiologyGeography: () => void;
      themes: () => void;
    };
    video: (video: Partial<Video>) => void;
    subject: (subject: Subject) => void;
    cartWithVideos: () => void;
    emptyPlaylist: () => void;
    playlistWithVideos: () => void;
  };
  inspect: () => FakeBoclipsClient;
  set: {
    facets: (facet: Partial<VideoFacets>) => void;
    features: (features: { [key in UserFeatureKey]?: boolean }) => void;
  };
}

export function bo(apiClient: FakeBoclipsClient): Bo {
  const boSetFacets = (facets: Partial<VideoFacets>) => {
    apiClient.videos.setFacets(
      FacetsFactory.sample({
        prices: [FacetFactory.sample({ hits: 10, id: '1000', name: '1000' })],
        channels: [
          FacetFactory.sample({
            hits: 17,
            id: 'channel-id',
            name: 'our channel',
          }),
        ],
        ...facets,
      }),
    );
  };

  const boSetProviderThemes = (themes: Partial<Theme>[]) => {
    const types = Array.from(new Set(themes.map((theme) => theme.type)));
    apiClient.alignments.setProviders([
      ProviderFactory.sample('openstax', { types }),
      ProviderFactory.sample('ngss'),
      ProviderFactory.sample('common core math'),
    ]);

    apiClient.alignments.setThemesByProvider({
      providerName: 'openstax',
      themes: themes.map((theme) => ({
        ...ThemeFactory.sample(theme),
        logoUrl:
          'https://assets.boclips.com/boclips-public-static-files/boclips/openstax/high_school_statistics_web_card.svg',
      })),
    });
  };

  const boSetFeatures = (features: {
    [key in UserFeatureKey]?: boolean;
  }) => {
    apiClient.users.setCurrentUserFeatures(features);
  };

  const boCreateSubject = (subject: Subject) => {
    apiClient.subjects.insertSubject(subject);
  };

  const boCreateVideo = (video: Partial<Video>) => {
    const fakeVideosClient = apiClient.videos as FakeVideosClient;
    const videoURL = 'http://localhost:9000/assets/blank.mp4';

    fakeVideosClient.insertVideo(
      VideoFactory.sample({
        id: Math.random().toString(36).substring(2, 15),
        title: 'test',
        price: { amount: 1000, currency: 'USD' },
        playback: PlaybackFactory.sample({
          links: {
            createPlaybackEvent: null,
            createPlayerInteractedWithEvent: null,
            download: null,
            thumbnail: new Link({
              href: 'http://localhost:9000/assets/icons/not-found.svg',
            }),
            setThumbnailBySecond: null,
            setCustomThumbnail: null,
            deleteThumbnail: null,
            videoPreview: null,
            hlsStream: new Link({ href: videoURL }),
          },
        }),
        links: {
          self: new Link({
            href: videoURL,
            templated: false,
          }),
          logInteraction: new Link({
            href: videoURL,
            templated: false,
          }),
        },
        ...video,
      }),
    );
  };

  const bigListOfVideos = Array.from(Array(15)).map((_, i) =>
    VideoFactory.sample({
      id: `${i}`,
      title: `video ${i}`,
      bestFor: [{ id: '1', label: 'Hook' }],
      createdBy: 'Ted',
    }),
  );

  return {
    inspect: () => apiClient,
    interact: (callback: (apiClient: FakeBoclipsClient) => void) => {
      callback(apiClient);
    },
    set: {
      facets: boSetFacets,
      features: boSetFeatures,
    },

    create: {
      video: boCreateVideo,
      subject: boCreateSubject,

      cartWithVideos: () => {
        apiClient.videos.insertVideo(
          VideoFactory.sample({
            id: '5f75b73f22a6495bdf2c2d14',
            releasedOn: new Date(2011, 11, 1),
            title:
              'TED-Ed: No one can figure out how eels have sex | Lucy Cooke',
          }),
        );

        apiClient.videos.insertVideo(
          VideoFactory.sample({
            id: '123',
            releasedOn: new Date(2011, 11, 1),
            title:
              'Jason & The Argonauts - The Epic Quest for the Golden Fleece (Greek Mythology)',
          }),
        );

        apiClient.carts.addItemToCart(null, '5f75b73f22a6495bdf2c2d14');
        apiClient.carts.addItemToCart(null, '123');
      },

      emptyPlaylist: () => {
        apiClient.collections.create({
          videos: [],
          title: 'My empty playlist',
          description: 'My empty playlist description',
        });
      },

      playlistWithVideos: () => {
        apiClient.collections.create({
          title: 'My playlist',
          description: 'My playlist description',
          videos: ['video-1', 'video-2', 'video-3'],
        });
      },

      fixtureSet: {
        eelsBiologyGeography: () => {
          const biology: Subject = SubjectFactory.sample({
            id: 'biology-id',
            name: 'Biology and Environmental Science',
          });
          const geography: Subject = SubjectFactory.sample({
            id: 'geography-id',
            name: 'Geography and Earth Science',
          });

          boCreateSubject(geography);
          boCreateSubject(biology);

          boCreateVideo({
            title:
              'TED-Ed: No one can figure out how eels have sex | Lucy Cooke',
            description:
              `From Ancient Greece to the 20th century, Aristotle, Freud, and numerous other scholars were all looking for ` +
              `the same thing: eel testicles. Freshwater eels could be found in rivers across Europe, but no one had ever seen ` +
              `them mate and no researcher could find eel eggs or identify their reproductive organs. So how do eels reproduce, ` +
              `and where do they do it? Lucy Cooke digs into the ancient mystery. [Directed by Anton Bogaty, narrated by Adrian ` +
              `Dannatt, music by Jarrett Farkas].`,
            subjects: [biology],
            releasedOn: new Date(1970, 1, 1),
            createdBy: 'TED-Ed',
          });

          boCreateVideo({
            title: 'Eel with DOUBLE JAWS has one Nasty Bite!',
            description:
              `On this episode, Mark and the crew are back in Queensland, Australia for another epic Tide Pool adventure!` +
              `As Mark explores, he comes across a Snowflake Eel - and this eel has double jaws.. and one nasty bite! ` +
              `What other creatures do you think they will come across along the Australian coast? Watch now to find out!`,
            subjects: [geography],
            releasedOn: new Date(2020, 3, 14),
            createdBy: 'TED-Ed',
          });

          boSetFacets(
            FacetsFactory.sample({
              subjects: [
                FacetFactory.sample({
                  id: biology.id,
                  name: biology.name,
                  hits: 1,
                }),
                FacetFactory.sample({
                  id: geography.id,
                  name: geography.name,
                  hits: 1,
                }),
              ],
            }),
          );
        },
        themes: () => {
          boSetFeatures({ BO_WEB_APP_SPARKS: true });
          boSetProviderThemes([
            ThemeFactory.sample({
              id: 'theme-1',
              provider: 'openstax',
              type: 'Maths',
              title: 'Maths book',
              topics: [
                {
                  title: 'Chapter 1: chapter-one',
                  index: 0,
                  targets: [
                    {
                      title: '1.1 section we dinna want to view',
                      videoIds: [],
                      index: 0,
                      videos: bigListOfVideos,
                    },
                    {
                      title: '1.2 section we want to view',
                      videoIds: [],
                      index: 1,
                      videos: [
                        VideoFactory.sample({
                          title: 'our target video',
                          bestFor: [{ id: '1', label: 'Hook' }],
                          createdBy: 'Ted',
                        }),
                      ],
                    },
                  ],
                },
              ],
            }),
            ThemeFactory.sample({
              id: 'theme-2',
              provider: 'openstax',
              type: 'Physics',
              title: 'Physics book',
            }),
            ThemeFactory.sample({
              id: 'theme-3',
              provider: 'openstax',
              type: 'Physics',
              title: 'Physics book 2',
            }),
            ThemeFactory.sample({
              id: 'theme-4',
              provider: 'openstax',
              type: 'Physics',
              title: 'Physics book 3',
            }),
            ThemeFactory.sample({
              id: 'theme-5',
              provider: 'openstax',
              type: 'Physics',
              title: 'Physics book 4',
            }),
            ThemeFactory.sample({
              id: 'theme-6',
              provider: 'openstax',
              type: 'Physics',
              title: 'Physics book 5',
            }),
            ThemeFactory.sample({
              id: 'theme-7',
              provider: 'openstax',
              type: 'Physics',
              title: 'Physics book 6',
            }),
            ThemeFactory.sample({
              id: 'theme-8',
              provider: 'openstax',
              type: 'Amazing subject',
              title: 'Amazing subject book',
            }),
            ThemeFactory.sample({
              id: 'theme-9',
              provider: 'openstax',
              type: 'Long subject name',
              title: 'Long subject book',
            }),
            ThemeFactory.sample({
              id: 'theme-10',
              provider: 'openstax',
              type: 'Geography',
              title: 'Geography book',
            }),
            ThemeFactory.sample({
              id: 'theme-11',
              provider: 'openstax',
              type: 'History',
              title: 'History book',
            }),
            ThemeFactory.sample({
              id: 'theme-12',
              provider: 'openstax',
              type: 'Architecture',
              title: 'Architecture book',
            }),
          ]);
        },
      },
    },
  };
}
