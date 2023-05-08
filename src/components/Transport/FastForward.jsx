import { Transport as t } from "tone";
import Button from "../Button";
import { ff } from "../../assets/icons";

export function FastForward({ song }) {
  return (
    <Button
      onClick={() =>
        (t.seconds =
          t.seconds < song.end - 10 ? t.seconds + 10 : (t.seconds = song.end))
      }
    >
      {ff}
    </Button>
  );
}
