// 轮播图
export type Banner = {
  targetId: number;
  url: string;
  imageUrl: string;
};
// 热门分类
export type HotTag = {
  id: number;
  name: string;
  position: number;
};
// 歌单
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  tracks: Song[];
};
// 歌手
export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  musicSize: number;
};
// 歌曲
export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
};
// 歌曲url
export type SongUrl = {
  id: number;
  url: string;
};

