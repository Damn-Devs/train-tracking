import React from "react";
import trackingData from "../assets/dummy-data/trackingData";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const TrackingChart = ({data}) => {
  console.log(data)
  
  return (
    <ResponsiveContainer width="100%">
      <LineChart data={data} width={730} height={250}>
        <CartesianGrid strokeDasharray="0" stroke="#b7ffe913" />
        <XAxis dataKey="name" stroke="#ddd" />

        <Line
          type="monotone"
          dataKey="revenue"
          data={data}
          stroke="#e1424e"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />

        <Tooltip wrapperClassName="tooltip__style" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// const TrackingChart = () => {
//   return (
//     <ResponsiveContainer width="100%">
//       <LineChart>
//         <CartesianGrid strokeDasharray="0" stroke="#b7ffe913" />
//         <XAxis dataKey="name" stroke="#ddd" />

//         <Line
//           type="monotone"
//           dataKey="revenue"
//           data={trackingData}
//           stroke="#e1424e"
//           strokeWidth={2}
//           activeDot={{ r: 8 }}
//         />

//         <Tooltip wrapperClassName="tooltip__style" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

export default TrackingChart;
