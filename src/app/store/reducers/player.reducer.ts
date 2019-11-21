import {PlayMode} from '../../share/music-ui/music-player/player-types';
import {Song} from '../../services/data-types/common.types';
import {SetCurrentIndex, SetPlaying, SetPlayList, SetPlayMode, SetSongList} from '../actions/player.action';
import {Action, createReducer, on} from '@ngrx/store';

export interface PlayState {
  // 播放状态
  playing: boolean;
  // 播放模式
  playMode: PlayMode;
  // 歌曲列表
  songList: Song[];
  // 播放列表
  playList: Song[];
  // 当前正在播放的索引
  currentIndex: number;
}

export const initialState: PlayState = {
  playing: false,
  songList: [],
  playList: [],
  playMode: {type: 'loop', label: '循环'},
  currentIndex: -1
};

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, {playing}) => ({ ...state, playing })),
  on(SetPlayList, (state, { playList }) => ({ ...state, playList })),
  on(SetSongList, (state, {songList}) => ({ ...state, songList })),
  on(SetPlayMode, (state, {playMode}) => ({ ...state, playMode })),
  on(SetCurrentIndex, (state, {currentIndex}) => ({ ...state, currentIndex }))
);

export function playerReducer(state: PlayState , action: Action) {
    return reducer(state, action);
}
