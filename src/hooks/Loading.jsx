/* eslint-disable react/prop-types */

import { CirclesWithBar } from "react-loader-spinner";

const Loading = ({ loading }) => {
  if (!loading) return null;
  return (
    <div>
      <CirclesWithBar
        color="#4fa94d"
        outerCircleColor="#4fa94d"
        innerCircleColor="#4fa94d"
        barColor="#4fa94d"
        visible={true}
      />
      llo
    </div>
  );
};

export default Loading;
