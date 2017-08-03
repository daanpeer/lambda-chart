import React from 'react'
import ReactDOMServer from 'react-dom/server'
import html from './html'
import { LineChart, XAxis, YAxis, CartesianGrid, Legend, Line, Tooltip } from 'recharts'

const Chart = ({ data }) => (
  <LineChart width={730} height={250} data={data}
    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
  </LineChart>
)

export const renderChart = (data) => {
  return html(ReactDOMServer.renderToStaticMarkup(<Chart data={data} />));
}
