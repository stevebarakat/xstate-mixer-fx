import { Transport as t } from "tone";
import Button from "../Button";
import { restart } from "../../assets/icons";

function Reset() {
  return (
    <Button
      onClick={() => {
        t.stop();
      }}
    >
      {restart}
    </Button>
  );
}

export default Reset;
