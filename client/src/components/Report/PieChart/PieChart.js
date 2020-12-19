import React from 'react';
import classes from './PieChart.module.css'
import * as d3 from 'd3'

const Arc = ({ arcData, colors, cost, index }) => {
  const arc = d3
    .arc()
    .innerRadius(60)
    .outerRadius(150)

  return (
    <g>
      <path key={index} d={arc(arcData)} fill={colors(cost)}></path>
      <text
        className={classes.Text}
        transform={`translate(${arc.centroid(arcData)})`}
        alignmentBaseline="middle"
        fontSize="1"
        fill="black"
        textAnchor="middle"
      >
        {arcData.data.typeOfExpense ? arcData.data.typeOfExpense + ' - ' : null} {cost ? cost + '€' : null}
      </text>
    </g>
  )
}


const Drilldownpie = ({ data, x, y }) => {

  const pie = d3
    .pie()
    .value(d => d.cost)

  const colors = d3
    .scaleLinear(["green", "orange", "red"])
    .domain([500, 1000, 5000])

  return (
    <g transform={`translate(${x}, ${x})`}>
      {pie(data).map((d, i) => {
        return (
          <Arc
            key={i}
            arcData={d}
            colors={colors}
            index={i}
            cost={d.data.cost}
          />
        )
      }
      )}
    </g>
  )
}


const pie = ({ data }) => {
  return (
    <div>
      <svg width="300" height="300">
        <Drilldownpie data={data} x={150} y={80} />
      </svg>
    </div>
  );
};

export default pie;