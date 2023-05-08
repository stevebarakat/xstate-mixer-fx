import { useEffect, useRef, useState } from "react";
import { loaded, Channel, Player, Transport as t, Destination } from "tone";

function useChannelStrip({ tracks }) {
  const channels = useRef([]);
  const players = useRef([]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    for (let i = 0; i < tracks.length; i++) {
      channels.current = channels.current && [
        ...channels.current,
        new Channel({ volume: 0 }),
      ];
      players.current = players.current && [
        ...players.current,
        new Player(tracks[i].path),
      ];
    }

    players.current?.forEach((player, i) => {
      channels.current &&
        player.chain(channels.current[i], Destination).sync().start("+0.5");
    });

    return () => {
      t.stop();
      players.current?.forEach((player, i) => {
        player.disconnect();
        channels.current && channels.current[i].disconnect();
      });
      players.current = [];
      channels.current = [];
    };
  }, [tracks]);

  useEffect(() => {
    loaded().then(() => setIsLoaded(true));
  }, [setIsLoaded]);

  return [channels, isLoaded];
}

export default useChannelStrip;
