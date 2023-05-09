import "./styles.css";
import { xIcon } from "../../assets/icons/xIcon";

function CloseButton({ ...props }) {
  return (
    <button
      style={{ margin: "0.65rem", padding: "0.65rem" }}
      className="button"
      {...props}
    >
      {xIcon}
    </button>
  );
}

export default CloseButton;
