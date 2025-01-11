/* eslint-disable react/prop-types */
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Reusable component with props
const SummaryCard = ({ title, description, chartData = [], chartConfig }) => {
  return (
    <Card className="flex flex-col rounded-lg shadow-lg hover:shadow-xl">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex justify-center items-center">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[300px] w-[100px] sm:w-[150px] lg:w-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                outerRadius={100}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="text-center text-muted-foreground">
            No data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
