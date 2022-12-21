import { Player } from 'boclips-player';

const boclipsPlayer: Player = {
  loadVideo: jest.fn(),
  pause: jest.fn(),
  play: jest.fn(),
  destroy: jest.fn(),
  onEnd: jest.fn(),
  onError: jest.fn(),
  onReady: jest.fn(),
};

export const PlayerFactory = {
  get: jest.fn().mockReturnValue(boclipsPlayer),
};
