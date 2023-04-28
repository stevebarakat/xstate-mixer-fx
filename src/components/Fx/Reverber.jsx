export default function Reverber({
  controls,
  currentTrack,
  currentTracks,
  currentMix,
  channelType,
  index,
}) {
  const trackReverbsMix = currentTrack.reverbsMix;
  const trackReverbsPreDelay = currentTrack.reverbsPreDelay;
  const trackReverbsDecay = currentTrack.reverbsDecay;
  const busReverbsMix = currentMix.reverbsMix;
  const busReverbsPreDelay = currentMix.reverbsPreDelay;
  const busReverbsDecay = currentMix.reverbsDecay;

  const changeReverbsMix = (e) => {
    if (typeof controls === "string") return;
    if (channelType === "track") {
      trackReverbsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(trackReverbsMix[index].toString());
    }
    if (channelType === "bus") {
      busReverbsMix[index] = parseFloat(e.currentTarget.value);
      controls.wet.value = parseFloat(busReverbsMix[index].toString());
    }
  };

  const updateReverbsMix = () => {
    if (channelType === "track") {
      const trackSettings = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        reverbsMix: trackReverbsMix,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackSettings));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        reverbsMix: busReverbsMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changeReverbsPreDelay = (e) => {
    if (channelType === "track") {
      trackReverbsPreDelay[index] = parseFloat(e.currentTarget.value);
      controls.preDelay = parseFloat(trackReverbsPreDelay[index].toString());
    }
    if (channelType === "bus") {
      busReverbsPreDelay[index] = parseFloat(e.currentTarget.value);
      controls.preDelay = parseFloat(busReverbsPreDelay[index].toString());
    }
  };

  const updateReverbsPreDelay = () => {
    if (channelType === "track") {
      const trackPreDelay = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        reverbsPreDelay: trackReverbsPreDelay,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackPreDelay));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        reverbsMix: busReverbsMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  const changeReverbsDecay = (e) => {
    if (channelType === "track") {
      trackReverbsDecay[index] = parseFloat(e.currentTarget.value);
      controls.decay = parseFloat(trackReverbsDecay[index].toString());
    }
    if (channelType === "bus") {
      busReverbsDecay[index] = parseFloat(e.currentTarget.value);
      controls.decay = parseFloat(busReverbsDecay[index].toString());
    }
  };

  const updateReverbsDecay = () => {
    if (channelType === "track") {
      const trackDecay = currentTracks?.map((currentTrack) => ({
        ...currentTrack,
        reverbsDecay: trackReverbsDecay,
      }));
      localStorage.setItem("currentTracks", JSON.stringify(trackDecay));
    }

    if (channelType === "bus") {
      const mixSettings = {
        ...currentMix,
        reverbsMix: busReverbsMix,
      };
      localStorage.setItem("currentMix", JSON.stringify(mixSettings));
    }
  };

  return (
    <div>
      <h3>Reverb</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="mix"
          min={0}
          max={1}
          step={0.01}
          onChange={changeReverbsMix}
          onPointerUp={updateReverbsMix}
          defaultValue={
            channelType === "bus"
              ? currentMix.reverbsMix[index]
              : currentTracks[index].reverbsMix[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="pre-delay">Pre Delay:</label>
        <input
          type="range"
          className="simple-range"
          name="pre-delay"
          min={0}
          max={1}
          step={0.01}
          onChange={changeReverbsPreDelay}
          onPointerUp={updateReverbsPreDelay}
          defaultValue={
            channelType === "bus"
              ? currentMix.reverbsPreDelay[index]
              : currentTracks[index].reverbsPreDelay[index].toString()
          }
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          className="simple-range"
          name="decay"
          min={0.1}
          max={20}
          step={0.1}
          onChange={changeReverbsDecay}
          onPointerUp={updateReverbsDecay}
          defaultValue={
            channelType === "bus"
              ? currentMix.reverbsDecay[index]
              : currentTracks[index].reverbsDecay[index].toString()
          }
        />
      </div>
    </div>
  );
}
