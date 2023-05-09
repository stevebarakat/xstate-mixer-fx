export function getSong(defaultSong) {
  const defaultSongString = JSON.stringify(defaultSong);
  let song =
    JSON.parse(localStorage.getItem("song")) ??
    localStorage.setItem("song", defaultSongString);
  let currentMix = JSON.parse(localStorage.getItem("currentMix"));
  let currentTracks = JSON.parse(localStorage.getItem("currentTracks"));

  if (!currentMix) {
    currentMix = {
      buses: {
        bus1fx1: "nofx",
        bus1fx2: "nofx",
        bus2fx1: "nofx",
        bus2fx2: "nofx",
      },
      busData: {
        bus1: { isOpen: false, position: { x: 0, y: 0 } },
        bus2: { isOpen: false, position: { x: 0, y: 0 } },
      },
      mainVolume: -32,
      busVolumes: [-32, -32],
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
