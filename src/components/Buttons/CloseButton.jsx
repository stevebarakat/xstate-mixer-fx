import "./styles.css";
import { xIcon } from "../../assets/icons/xIcon";

function CloseButton({ ...props }) {
  return (
    <button
      style={{
        margin: "8px",
        padding: "4px",
        // position: "relative",
        right: "4px",
        top: "2px",
      }}
      className="button"
      {...props}
    >
      {xIcon}
    </button>
  );
}

export default CloseButton;
