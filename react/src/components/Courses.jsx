import CourseCard from './CourseCard.jsx';
import './styles/ModelGrid.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'




class Courses extends Component{
  constructor(props){
    super(props);
    this.state = {
      courseList: [],
      page: 1,
      pageSize: 30,
      maxPage: 10
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(event){
    console.log(event.selected)
    this.setState({page: Number(event.selected+1)})
  }


  componentDidMount(){
    const url = 'http://api.learning2earn.me/courses';

    fetch(url)
      .then((response) => {return response.json()})
      .then((courseJson) =>{
        return courseJson
      })
      .catch((error) => {console.log(error.message); return []})
      .then((info) => {this.setState({courseList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})

  }

  render(){
    var {courseList, page, pageSize, maxPage} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var courseArr = courseList.slice(firstInd,lastInd)
    var courseCards = courseArr.map((course, i) =>
      <div className="col-sm-4" key={i} >
      <div className='card'>
        <CourseCard provider={course["provider"]} price={course["price"]} courseId={course["id"]} courseName={course["course"]} image={course["image"]} relJobs={course['job-ids'].length}/>
      </div>
      </div>
    );

    return(
      <div className='box'>
        <Row className='cards'>
    	     {courseCards}
         </Row>
         <div className='pages' >
         <ReactPaginate previousLabel={"previous"}
                     nextLabel={"next"}
                     breakLabel={<a>...</a>}
                     breakClassName={"break-me"}
                     pageCount={this.state.maxPage}
                     marginPagesDisplayed={2}
                     pageRangeDisplayed={5}
                     onPageChange={this.handlePageChange}
                     containerClassName={"pagination"}
                     subContainerClassName={"pages pagination"}
                     activeClassName={"active"} />
          </div>
      </div>
    );
  }
}
export default Courses;
