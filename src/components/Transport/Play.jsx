import { context, start, Transport as t } from "tone";
import Button from "../Button";
import { play, pause } from "../../assets/icons";

function Play() {
  return (
    <Button
      onClick={() => {
        if (context.state === "suspended") {
          start(); // initialize audio context
          t.start();
        } else if (t.state !== "started") {
          t.start();
        } else {
          t.pause();
        }
      }}
    >
      {t.state !== "started" ? play : pause}
    </Button>
  );
}

export default Play;
