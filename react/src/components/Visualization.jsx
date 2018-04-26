import React, { Component } from 'react';
import * as d3 from 'd3';
import {geoPath} from "d3-geo";
import { select } from 'd3-selection';
// import {albersUsa} from "d3-geo-projection";
class Visualization extends Component{

	constructor(props){
		super(props)
	}

	render(){

		var width = 960,
		    height = 500,
		    centered;

		var projection = d3.geoAlbersUsa()
		    .scale(width)
		    .translate([0, 0]);

		var path = geoPath()
		    .projection(projection);

		var svg = d3.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		// svg.append("rect")
		//     .attr("class", "background")
		//     .attr("width", width)
		//     .attr("height", height);
		    // .on("click", click);
		var url = "https://raw.githubusercontent.com/iambrandonchan/learning2earn/master/react/src/components/state_parks.csv";
		var data = [];
		d3.csv(url, function(d) {
			d['num_parks'] = parseInt(d['num_parks']);
			data.push(d);
		});

		// d3.json("https://bubinga.co/wp-content/uploads/jsonstates.min_.js", function(json){
		// 	console.log(json.features);
		// });

		svg.selectAll("path")
			.data(data)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", function(d) {
				return "rgb(213,222,217)";
			});

	 	return(
        <p>LOL</p>
	    );
	}
}
export default Visualization;
