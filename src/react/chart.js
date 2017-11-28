import React from 'react'
import ReactDOMServer from 'react-dom/server'
import html from './html'
import { LineChart, XAxis, YAxis, Legend, Line, Tooltip } from 'recharts'

const Chart = ({ data, lines }) => (
  <LineChart
    width={730}
    height={250}
    data={data}
    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
  >
    <XAxis dataKey='name' />
    <YAxis />
    <Tooltip />
    <Legend
      verticalAlign='top'
      margin={{
        top: 20
      }}
    />
    {lines.map(line => (
      <Line
        type={line.type}
        dataKey={line.dataKey}
        stroke={line.stroke}
      />
    ))}
  </LineChart>
)

const renderChart = ({ data, lines }) => {
  console.log('rendering chart with data: ', data, lines)
  html(ReactDOMServer.renderToStaticMarkup(
    <Chart
      data={data}
      lines={lines}
    />))
}

export default renderChart
