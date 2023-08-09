import { useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const revenueChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#2884ff" />
        <Bar
          dataKey="revenueStats"
          stroke="#2884ff"
          fill="#2884ff"
          barSize={30}
        />

        <Tooltip wrapperClassName="tooltip__style" cursor={false} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default revenueChart;
