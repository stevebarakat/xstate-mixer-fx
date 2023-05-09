import "./styles.css";

function TransportButton({ children, ...props }) {
  return (
    <button style={{ padding: "1.025rem" }} className="button" {...props}>
      {children}
    </button>
  );
}

export default TransportButton;
