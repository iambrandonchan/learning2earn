import React, { Component } from 'react';
import * as d3 from 'd3';
class Visualization extends Component{

	constructor(props){
		super(props)
	}

	render(){
		var dataset = [];
		d3.csv("state_parks.csv", function(d) {
			console.log(d);
		});
	 	return(
        <p>LOL</p>
	    );
	}
}
export default Visualization;
