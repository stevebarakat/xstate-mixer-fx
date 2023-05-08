import { Transport as t } from "tone";
import Button from "../Button";
import { rew } from "../../assets/icons";

function Rewind({ song }) {
  return (
    <Button
      onClick={() =>
        (t.seconds = t.seconds > 10 + song.start ? t.seconds - 10 : song.start)
      }
    >
      {rew}
    </Button>
  );
}

export default Rewind;
