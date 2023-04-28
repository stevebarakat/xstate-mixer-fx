export function getSong(defaultSong) {
  const defaultSongString = JSON.stringify(defaultSong);
  let song = JSON.parse(localStorage.getItem("song")!);
  let currentMix = JSON.parse(localStorage.getItem("currentMix")!);
  let currentTracks = JSON.parse(localStorage.getItem("currentTracks")!);
  if (!song) {
    localStorage.setItem("song", defaultSongString);
    song = defaultSong;
  }

  if (!currentMix) {
    currentMix = {
      songSlug: "roxanne",
      reverbsMix: [0.5, 0.5],
    };
    localStorage.setItem("currentMix", JSON.stringify(currentMix));
  }

  if (!currentTracks) {
    localStorage.setItem("currentTracks", JSON.stringify(defaultSong.tracks));
    currentTracks = defaultSong.tracks;
  }

  return [song, currentTracks];
}
