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
import { FeatureKey } from 'boclips-api-client/dist/sub-clients/common/model/FeatureKey';
import { ThemeFactory } from 'boclips-api-client/dist/test-support/ThemeFactory';
import { Theme } from 'boclips-api-client/dist/sub-clients/alignments/model/theme/Theme';
import { ProviderFactory } from 'src/views/alignments/provider/ProviderFactory';
import { Discipline } from 'boclips-api-client/dist/sub-clients/disciplines/model/Discipline';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { PromotedForProduct } from 'boclips-api-client/dist/sub-clients/collections/model/PromotedForProduct';

export interface Bo {
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
    featuredPlaylists: () => void;
    user: () => void;
    trialAdminUser: () => void;
    trialRegularUser: () => void;
  };
  inspect: () => FakeBoclipsClient;
  set: {
    facets: (facet: Partial<VideoFacets>) => void;
    features: (features: { [key in FeatureKey]?: boolean }) => void;
  };
  remove: {
    cartLink: () => void;
  };

  interact(callback: (apiClient: FakeBoclipsClient) => void): void;
}

export function bo(apiClient: FakeBoclipsClient): Bo {
  delete apiClient.links.cart;
  delete apiClient.links.userOrders;
  const boSetFacets = (facets: Partial<VideoFacets>) => {
    apiClient.videos.setFacets(
      FacetsFactory.sample({
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

  const boSetUpUser = async (features: {
    [key in FeatureKey]?: boolean;
  }) => {
    apiClient.users.insertCurrentUser(
      UserFactory.sample({
        account: {
          ...UserFactory.sample().account,
          products: [Product.LIBRARY],
        },
      }),
    );

    console.log(
      'setting features of user: ',
      await apiClient.users.getCurrentUser(),
    );
    console.log('new features: ', JSON.stringify(features));

    apiClient.users.setCurrentUserFeatures(features);
    console.log(
      'set features of user: ',
      JSON.stringify(await apiClient.users.getCurrentUser()),
    );
  };

  const boCreateSubject = (subject: Subject) => {
    apiClient.subjects.insertSubject(subject);
  };

  const boCreateDiscipline = (discipline: Discipline) => {
    apiClient.disciplines.insertMyDiscipline(discipline);
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
      features: boSetUpUser,
    },
    remove: {
      cartLink: () => delete apiClient.links.cart,
    },
    create: {
      video: boCreateVideo,
      user: async () => {
        apiClient.users.insertCurrentUser(
          UserFactory.sample({
            firstName: 'Percy',
            account: {
              ...UserFactory.sample().account,
              id: 'acc-id',
              name: 'Percy account',
              type: AccountType.STANDARD,
            },
          }),
        );
        apiClient.accounts.insertAccount(
          AccountsFactory.sample({ id: 'acc-id' }),
        );
      },
      trialAdminUser: async () => {
        apiClient.users.insertCurrentUser(
          UserFactory.sample({
            firstName: 'Percy',
            account: {
              id: 'acc-id',
              name: 'Percy account',
              type: AccountType.TRIAL,
              marketingInformation: null,
              createdAt: new Date(),
            },
            hasAcceptedTermsAndConditions: true,
          }),
        );
        apiClient.accounts.insertAccount(
          AccountsFactory.sample({ id: 'acc-id', type: AccountType.TRIAL }),
        );
      },
      trialRegularUser: async () => {
        apiClient.users.insertCurrentUser(
          UserFactory.sample({
            firstName: 'Percy',
            account: {
              id: 'acc-id',
              name: 'Percy account',
              type: AccountType.TRIAL,
              marketingInformation: {
                companySegments: ['Edtech'],
              },
              createdAt: new Date(),
            },
          }),
        );
        apiClient.accounts.insertAccount(
          AccountsFactory.sample({
            id: 'acc-id',
            type: AccountType.TRIAL,
            marketingInformation: {
              companySegments: ['Edtech'],
            },
          }),
        );
      },
      subject: boCreateSubject,

      featuredPlaylists: async () => {
        apiClient.videos.insertVideo(
          VideoFactory.sample({
            id: '5f75b73f22a6495bdf2c2d14',
            releasedOn: new Date(2011, 11, 1),
            title:
              'TED-Ed: No one can figure out how eels have sex | Lucy Cooke',
            price: {
              currency: 'USD',
              amount: 1000,
            },
          }),
        );

        const collectionId = await apiClient.collections.create({
          title: 'My featured playlist',
          description: 'My playlist description',
          videos: [
            '5f75b73f22a6495bdf2c2d14',
            '5f75b73f22a6495bdf2c2d14',
            '5f75b73f22a6495bdf2c2d14',
          ],
        });

        apiClient.collections.update(collectionId, {
          promotedFor: [PromotedForProduct.LIBRARY],
        });
      },

      cartWithVideos: () => {
        apiClient.videos.insertVideo(
          VideoFactory.sample({
            id: '5f75b73f22a6495bdf2c2d14',
            releasedOn: new Date(2011, 11, 1),
            title:
              'TED-Ed: No one can figure out how eels have sex | Lucy Cooke',
            price: {
              currency: 'EUR',
              amount: 123,
            },
          }),
        );

        apiClient.videos.insertVideo(
          VideoFactory.sample({
            id: '123',
            releasedOn: new Date(2011, 11, 1),
            title:
              'Jason & The Argonauts - The Epic Quest for the Golden Fleece (Greek Mythology)',
            price: {
              currency: 'EUR',
              amount: 123,
            },
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

          const discipline: Discipline = {
            id: 'discipline-id',
            name: 'Discipline',
            code: 'discipline-code',
            subjects: [biology, geography],
          };

          boCreateSubject(geography);
          boCreateSubject(biology);

          boCreateDiscipline(discipline);

          boCreateVideo({
            id: '63b13799900058706766b222',
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
            id: '321',
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
