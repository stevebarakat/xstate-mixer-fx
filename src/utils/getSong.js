export function getSong(defaultSong) {
  const defaultSongString = JSON.stringify(defaultSong);
  let song = JSON.parse(localStorage.getItem("song"));
  let currentMix = JSON.parse(localStorage.getItem("currentMix"));
  let currentTracks = JSON.parse(localStorage.getItem("currentTracks"));

  if (!song) {
    localStorage.setItem("song", defaultSongString);
    song = defaultSong;
  }

  if (!currentMix) {
    currentMix = {
      songSlug: "roxanne",
      reverbsMix: [
        [0.5, 0.5],
        [0.5, 0.5],
      ],
      reverbsPreDelay: [
        [0.5, 0.5],
        [0.5, 0.5],
      ],
      reverbsDecay: [
        [0.5, 0.5],
        [0.5, 0.5],
      ],
      delaysMix: [
        [0.5, 0.5],
        [0.5, 0.5],
      ],
      delaysTime: [
        [0.5, 0.5],
        [0.5, 0.5],
      ],
      delaysFeedback: [
        [0.5, 0.5],
        [0.5, 0.5],
      ],
    };
    localStorage.setItem("currentMix", JSON.stringify(currentMix));
  }

  if (!currentTracks) {
    currentTracks = defaultSong.tracks.map((track) => ({
      name: track.name,
      path: track.path,
      volume: -32,
      pan: 0,
      mute: false,
      solo: false,
    }));
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
  }

  return [song, currentMix, currentTracks];
}
