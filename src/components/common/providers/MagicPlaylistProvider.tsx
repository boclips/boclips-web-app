import React, { useReducer } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { v4 as uuid } from 'uuid';

type Action =
  | { action: 'add-video'; video: Video }
  | { action: 'remove-widget'; id: string }
  | { action: 'add-comment'; text?: string }
  | { action: 'add-section'; text?: string }
  | { action: 'reorder'; from: string; to: string }
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
        uuid: uuid(),
      };

      newState.push(video);

      console.log(state);

      return newState;
    }

    case 'remove-widget': {
      const newState = [...state];
      const uuids = newState.map((it) => it.uuid);
      const indexOfElementToRemove = uuids.indexOf(action.id);

      newState.splice(indexOfElementToRemove, 1);

      return newState;
    }

    case 'add-comment': {
      const newState = [...state];

      const comment = {
        type: 'comment',
        text: action.text,
        uuid: uuid(),
      };

      newState.push(comment);

      return newState;
    }

    case 'add-section': {
      const newState = [...state];

      const comment = {
        type: 'section',
        text: action.text,
        uuid: uuid(),
      };

      newState.push(comment);

      return newState;
    }

    case 'reorder': {
      const newState = [...state];

      console.log({ from: action.from, to: action.to });
      const uuids = newState.map((it) => it.uuid);
      const from = uuids.indexOf(action.from);
      const to = uuids.indexOf(action.to);

      const el = newState.splice(from, 1);

      newState.splice(to, 0, el);

      console.log(newState);

      return newState.flat(1);

      // const comment = {
      //   type: 'section',
      //   text: action.text,
      //   uuid: uuid(),
      // };
      //
      // newState.push(comment);
      //
      // return newState;
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
