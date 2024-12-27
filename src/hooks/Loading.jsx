/* eslint-disable react/prop-types */

const Loading = ({ loading }) => {
  if (!loading) return null;
  return (
    <div style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>
      Loading...
    </div>
  );
};

export default Loading;
