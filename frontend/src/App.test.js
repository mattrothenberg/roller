import extractYoutubeId from './extract-youtube-id';

describe('extracting youtube video id out of various kinds of youtube links', () => {
  it('pulls out the "v" param', () => {
    let id = extractYoutubeId("https://www.youtube.com/watch?v=CMNry4PE93Y");
    expect(id).toEqual('CMNry4PE93Y');
  });

  it('pulls out the path variable for a shared link', () => {
    let id = extractYoutubeId("https://youtu.be/CMNry4PE93Y");
    expect(id).toEqual('CMNry4PE93Y');
  })
});
