import { Player } from 'boclips-player';

const boclipsPlayer: Player = {
  loadVideo: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
  destroy: vi.fn(),
  onEnd: vi.fn(),
  onError: vi.fn(),
  onReady: vi.fn(),
};

export const PlayerFactory = {
  get: vi.fn().mockReturnValue(boclipsPlayer),
};
