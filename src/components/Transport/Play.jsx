import { context, start, Transport as t } from "tone";
import Button from "../Button";
import { play, pause } from "../../assets/icons";

function Play() {
  console.log("t.state", t.state);
  return (
    <Button
      onClick={() => {
        if (t.state !== "started") {
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
