import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Label,
} from 'recharts';

type SimpleLineChartProps<T extends Record<string, any>> = {
    data: T[];
    xKey: keyof T;
    yKey: keyof T;
    xLabel?: string;
    yLabel?: string;
    color?: string;
};

export default function SimpleLineChart<T extends Record<string, any>>({
                                                                           data,
                                                                           xKey,
                                                                           yKey,
                                                                           xLabel = 'Time',
                                                                           yLabel = 'Plays',
                                                                           color = '#04732e',
                                                                       }: SimpleLineChartProps<T>) {
    return (
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                    <XAxis
                        dataKey={xKey as string}
                        fontSize={12}
                        tickMargin={6}
                    >
                        <Label value={xLabel} position="bottom" offset={0} />
                    </XAxis>
                    <YAxis
                        fontSize={12}
                        tickMargin={6}
                        allowDecimals={false}
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => value}
                    >
                        <Label
                            value={yLabel}
                            angle={-90}
                            position="insideLeft"
                            style={{ textAnchor: 'middle' }}
                        />
                    </YAxis>

                    <Tooltip
                        contentStyle={{ fontSize: 12 }}
                        labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Line
                        type="monotone"
                        dataKey={yKey as string}
                        stroke={color}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
