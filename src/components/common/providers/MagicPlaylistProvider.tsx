import React, { useReducer } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

type Action =
  | { action: 'add-video'; video: Video }
  | { action: 'add-comment'; text?: string }
  | { action: 'add-section'; text?: string }
  | { action: 'clear-context' };

type Dispatch = (action: Action) => void;

type State = Record<string, string | Video>[];

type AccessRulesProviderProps = {
  children: React.ReactNode;
};

const MagicPlaylistContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const initialState = (): State => {
  return [];
};

function playlistLayoutReducer(state: State, action: Action): State {
  switch (action.action) {
    case 'add-video': {
      const newState = [...state];

      const video = {
        type: 'video',
        video: action.video,
      };

      newState.push(video);

      console.log(state);

      return newState;
    }
    case 'add-comment': {
      const newState = [...state];

      const comment = {
        type: 'comment',
        text: action.text,
      };

      newState.push(comment);

      return newState;
    }

    case 'add-section': {
      const newState = [...state];

      const comment = {
        type: 'section',
        text: action.text,
      };

      newState.push(comment);

      return newState;
    }

    case 'clear-context': {
      return [];
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

function useMagicPlaylistContext() {
  const context = React.useContext(MagicPlaylistContext);
  if (context === undefined) {
    throw new Error(
      'useAccessRulesForm must be used within a Access Rules Provider',
    );
  }
  return context;
}

const MagicPlaylistProvider = ({ children }: AccessRulesProviderProps) => {
  const [state, dispatch] = useReducer(playlistLayoutReducer, initialState());

  const value = { state, dispatch };

  return (
    <MagicPlaylistContext.Provider value={value}>
      {children}
    </MagicPlaylistContext.Provider>
  );
};

export { useMagicPlaylistContext, MagicPlaylistProvider };
