import React, { Component } from 'react';
import * as d3 from 'd3';
// import us_states from './us-states.js'
import {geoPath} from "d3-geo";
import { select } from 'd3-selection';
// import {albersUsa} from "d3-geo-projection";
import './styles/Visualization.css';
import { BarLoader } from 'react-spinners'


class Visualization extends Component{

	constructor(props){
		super(props)
		this.state = {
	      parks:[],
	      snapshots:[],
	      us_states:[],
	      ready: false
	    }
	}

	componentWillMount(){
		var url = "https://raw.githubusercontent.com/iambrandonchan/learning2earn/master/react/src/components/state_parks.csv";
		var data = [];
		d3.csv(url, function(d) {
			d['num_parks'] = parseInt(d['num_parks']);
			data.push(d);
		});
		var url_snap = "https://raw.githubusercontent.com/iambrandonchan/learning2earn/master/react/src/components/snapshots.csv";
		var snap_data = [];
		d3.csv(url_snap, function(d) {
			d['views'] = parseInt(d['views']);
			snap_data.push(d);
		})

		var url_j = "https://raw.githubusercontent.com/iambrandonchan/learning2earn/master/react/src/components/us-states.json";
		
		fetch(url_j)
			.then( (res) => { return res.json() })
			.then( (json) => { 
				this.setState({parks:data, snapshots:snap_data, us_states:json[0]['features'], ready: true}, () => {	
			})
			})
	}



	render(){

		if (!this.state.ready) {
			return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>);
		}

		var parks = this.state['parks'];
		var snaps = this.state['snapshots'];
		var new_us_states = this.state['us_states'];
		for (let i = 0; i<parks.length; i++){
			let state_name = parks[i]['state'];
			let state_value = parks[i]['num_parks'];
			let state_views = 0;
			for (let j = 0; j<snaps.length; j++){
				if (snaps[j]['state']==state_name){
					state_views = snaps[j]['views'];
				}
			}
			for (let j = 0; j<new_us_states.length; j++){
				let json_state = new_us_states[j]['properties']['NAME']
				if (state_name == json_state){
					new_us_states[j]['properties']['num_parks'] = state_value;
					new_us_states[j]['properties']['views'] = state_views;
				}
			}

		}
		var params = ['num_parks','views'];
		var domains = [[2,115],[0,28902]];
		var color_scales = [["#fff86b","#f21818"],["#a0edff","#2027f7"]]
		var titles = ['Parks per State Heatmap', 'Snapshot Views per State Heatmap']
		for (let i = 0; i<params.length; i++){
			let param = params[i];
			var domain = domains[i];
			var title = titles[i];
			var color_scale = color_scales[i];

			var width = 1200,
			    height = 600,
			    centered;

			var projection = d3.geoAlbersUsa()
			    .scale(width)
			    .translate([width/2, height/2]);

			var path = geoPath()
			    .projection(projection);

			var color = d3.scaleLinear()
				  .domain(domain)
				  .range(color_scale);

			var svg = d3.select("body").append("svg")
			    .attr("width", width)
			    .attr("height", height)

			svg.append("rect")
			    .attr("class", "background")
			    .attr("width", width)
			    .attr("height", height)

			svg.append("text")
		        .attr("x", (width / 2))             
		        .attr("y", (100 / 2))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "20px")   
		        .text(title);

			
			var div = d3.select("body").append("div")	
			    .attr("class", "tooltip")				
			    .style("opacity", 0);
			svg.selectAll("path")
				.data(new_us_states)
				.enter()
				.append("path")
				.attr("d", path)
				.style("stroke", "#fff")
				.style("stroke-width", "1")
				.style("fill", function(d) {
					let value = d['properties'][param];
					if (value){
						return color(value);
					}
					return color_scale[0];
				})
				.on("mouseover", function(d) {
					let value = d['properties'][param];
					if (!value){
						value = 0;
					}		
		            div.transition()		
		                .duration(200)		
		                .style("opacity", .9);		
		            div	.html(d['properties']['NAME'] + "<br/>"  + value)
		                .style("left", (d3.event.pageX) + "px")
		                .style("top", (d3.event.pageY - 28) + "px")
		         })
				.on("mouseout", function(d) {		
		            div.transition()		
		                .duration(500)		
		                .style("opacity", 0);
	        	})
        }

	 	return(
        <p></p>
	    );
	}
}
export default Visualization;
