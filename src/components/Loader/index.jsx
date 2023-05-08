import "./styles.css";

const Spinner = ({ song }) => {
  return (
    <div className="loader">
      <span>
        Loading: {song.artist} - {song.title}
      </span>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Spinner;
