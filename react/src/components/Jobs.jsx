import JobCard from './JobCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Collapse} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Select from "react-virtualized-select";
import { BarLoader } from 'react-spinners'

var card_remove_border = {
    'borderStyle': 'none'
};

const providersList = ["Authentic Jobs", "GitHub Jobs"]
const sortQueries  = ["name", "name&desc=TRUE", "company", "company&desc=TRUE", "provider", "provider&desc=TRUE", "location", "location&desc=TRUE", "num-related-courses", "num-related-courses&desc=TRUE"]
const numCourse = ["0..200", "200..400", "400..600", "600..800", "800..1000", "1000..1200", "1200..1400"]
const jobType = ["Part-time","Full-time","Contract"]

class Jobs extends Component{
  constructor(props){
    super(props)
    this.state = {
      jobList: [],
      page: 1,
      pageSize: 32,
      maxPage: 10,
      sortOpen: false,
      filterOpen: false,
      queries: {},
      sortOption: '',
      providerOption: '',
      locationOptions: '',
      locationList:'',
      locationNames:'',
      companyList:[],
      companyNames: '',
      companyOption: '',
      typeOption:'',
      subjectList:[],
      subjectIdList: [],
      subjectOption: '',
      ready: false
    }
    this.handlePageChange = this.handlePageChange.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.sortChange = this.sortChange.bind(this)
    this.numCourseChange = this.numCourseChange.bind(this)
    this.providerChange = this.providerChange.bind(this)
    this.getFilters = this.getFilters.bind(this)
    this.companyChange = this.companyChange.bind(this)
    this.typeChange = this.typeChange.bind(this)
    this.locationChange = this.locationChange.bind(this)
    this.saveState = this.saveState.bind(this)
    this.resetState = this.resetState.bind(this)
    this.getSubjects = this.getSubjects.bind(this)
    this.getSubjectNames = this.getSubjectNames.bind(this)
    this.subjectChange = this.subjectChange.bind(this)
  }

  typeChange(choice){
    //Method for updating when a job type filter is chosen
    this.setState({typeOption: choice})
    var str = ''
    if (choice != null){
      str = 'jobtype=' + jobType[choice - 1]
    }
    var temp = this.state.queries
    temp.jobType = str
    this.setState({queries: temp}, this.makeQuery(true))
  }

  subjectChange(choice){
    //Method for updating when a subject filter is chosen
    this.setState({subjectOption: choice})
    var str = ''
    if (choice != null){
      str = 'subjectId=' + this.state.subjectIdList[choice - 1]
    }
    var temp = this.state.queries
    temp.subject = str
    this.setState({queries: temp}, this.makeQuery(true))
  }

  locationChange(choice){
    //Method for updating when a location filter is chosen
    this.setState({locationOption: choice})
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return encodeURI(this.state.locationNames[parseInt(a)-1])})
    var str = ''
    if (!(choiceArr.includes(NaN) || choice == '' || choice == null)){
      for (let c in choiceArr) {
        str = 'location=' + choiceArr[c]
        if (c < choiceArr.length -1){
          str += '&'
        }
      }
      console.log(this.state.queries)
    }
    var temp = this.state.queries
    temp.locations = str
    this.setState({queries: temp}, this.makeQuery(true))
  }

  companyChange(choice){
    //Method for updating when a company filter is chosen
    this.setState({companyOption: choice})
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return encodeURI(this.state.companyNames[parseInt(a)-1])})
    var str = ''
    if (!(choiceArr.includes(NaN) || choice == '' || choice == null)){
      for (let c in choiceArr) {
        str += 'company=' + choiceArr[c]
        if (c < choiceArr.length -1){
          str += '&'
        }
      }
    }
    var temp = this.state.queries
    temp.companies = str
    this.setState({queries: temp}, this.makeQuery(true))
  }

  providerChange(choice){
    //Method for updating when a provider filter is chosen
    this.setState({providerOption: choice})
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return encodeURI(providersList[parseInt(a)-1])})
    var str = ''
    if (!(choiceArr.includes(NaN) || choice == '' || choice == null)){
        for (let c in choiceArr){
          str += 'provider=' + choiceArr[c]
          if (c < choiceArr.length -1){
            str += '&'
          }
        }
    }
    var temp = this.state.queries
    temp.providers = str
    this.setState({queries: temp}, this.makeQuery(true))
  }

  sortChange(choice){
    //Method for updating for when a sorting option is chosen
    this.setState({sortOption: choice})
    var str = ''
    if(choice != null){
      str = 'sort_by=' + sortQueries[choice - 1]
    }
    var temp = this.state.queries
    temp.sort = str
    this.setState({queries: temp}, this.makeQuery(true))
  }

  numCourseChange(choice){
    //Method for updating for when a number of courses filter is chosen
    this.setState({numCourseOption: choice})
    var str = ''
    if (choice != null){
      str = 'num-related-courses=' + numCourse[choice - 1]
    }
    var temp = this.state.queries
    temp.numCourse = str
    this.setState({queries: temp}, this.makeQuery(true))
  }

  makeQuery(isFilter){
    //Helper method for making an API call by stacking queries
    var newPage = this.state.page
    if (isFilter){
      newPage = 1
    }
    var url = 'http://api.learning2earn.me/jobs'
    var first = true
    var queries = this.state.queries
    console.log(queries)
    for (let key in queries){
      if (first){
        url += '?' + queries[key]
        first = false
      }
      else{
        url += '&' + queries[key]
      }
    }
    console.log(url)

    fetch(url)
      .then((response) => {return response.json()})
      .then((json) => {
        var sorted = json
        this.setState({jobList: sorted, page: newPage, maxPage: Math.ceil(sorted.length / this.state.pageSize), ready: true}, this.saveState())
      })

  }

  getFilters(name){
    /* Given a field, fetches the field and builds an array formatted for
    use as the options for a select object
    */
    var filters = new Set()
    for (let job of this.state.jobList){
      filters.add(job[name])
    }
     return Array.from(filters).map((name,i) => { return {label: name, value: i+1} })
  }

  getSubjects(){
    //Fetches subjects from the API and stores them
    var subjectIds = new Set()
    for (let job of this.state.jobList){
      var subList = job['subject-ids']
      for (let id of subList){
        subjectIds.add(id)
      }
    }
    var ids = Array.from(subjectIds)
    this.setState({subjectIdList: ids}, this.getSubjectNames(ids))
  }

  getSubjectNames(subjectIds){
    //Helper method for getSubjects
    if (subjectIds.length == 0){
      return;
    }
    var url = 'http://api.learning2earn.me/subjects?subjectId=' + subjectIds.pop()
    fetch(url)
      .then((response) => {return response.json()})
      .then((json) => {
        var temp = this.state.subjectList.filter(name => name != null)
        temp.push(json[0])
        this.setState({subjectList: temp}, () => {
          this.getSubjectNames(subjectIds)})
      })
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
    window.scrollTo(0,0)
  }

  componentWillMount(){
    const url = 'http://api.learning2earn.me/jobs';
    fetch(url)
      .then((response) => {return response.json()})
      .catch((error) => {console.log(error.message)})
      .then((info) => {this.setState({jobList: info, maxPage: Math.ceil(info.length / this.state.pageSize)},
        () => {
          //Fetch additional data needed
          this.getSubjects()
          this.state.companyList = this.getFilters("company");
          this.state.companyNames = this.state.companyList.map((dict)=>{return dict["label"]})
          this.state.locationList = this.getFilters("location")
          this.state.locationNames = this.state.locationList.map((dict)=>{return dict["label"]})
          this.resetState()
        })})
      .catch((error) => {console.log(error.message)})
  }

  resetState(){
    //Recovers state from browser local storage
    const rehydrate = JSON.parse(localStorage.getItem('jobsSavedState'))
    if (rehydrate != null){
      this.state = rehydrate
    }
    this.setState(rehydrate)
    this.makeQuery(false)
  }

  componentWillUnmount(){
    this.saveState()
  }

  saveState(){
    //Saves state in browser local storage
    var toSave = this.state
    toSave.jobList = []
    localStorage.setItem('jobsSavedState', JSON.stringify(toSave))
  }

  render(){
    //Loading icon if data isn't here yet
    if (!this.state.ready){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }

    if(this.state.subjectIdList == undefined){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }

    const providerOptions = [{label: "Authentic Jobs", value: 1}, {label: "GitHub Jobs", value: 2}]
    const  numCourseOptions = [{label: "between 0 and 200 courses", value: 1},{label: "between 200 and 400 courses", value: 2},
    {label: "between 400 and 600 courses", value: 3}, {label: "between 600 and 800 courses"}, {label: "between 800 and 1000 courses", value: 4},
    {label: "between 1000 and 1200 courses", value: 5}, {label: "between 1200 and 1400 courses", value: 6}]
    const sortOptions=[{label: "Name (alphabetical)",  value: 1}, {label: "Name (Descending alphabetical)", value: 2},
    {label: "Company (alphabetical)", value: 3}, {label: "Company (Descending alphabetical)", value: 4},
    {label: "Provider (alphabetical)", value: 5}, {label: "Provider (Descending alphabetical)", value: 6},
    {label: "Location (alphabetical)", value: 7}, {label: "Location (Descending alphabetical)", value: 8},
    {label: "Number of courses", value: 9}, {label: "Number of courses (Descending)", value: 10}]
    const  typeOptions = [{label:"Part-time", value: 1},{label: "Full-time", value: 2}, {label: "Contract", value: 3}]
    const companyOptions = this.state.companyList
    const locationOptions = this.state.locationList
    //Buidling parallel arrays for the subjects filter
    var subjectOptions = []
    var subjectIds = []
    var i = 1
    for (let sub of this.state.subjectList){
      subjectOptions.push({label: sub.subject, value: i++})
      subjectIds.push(sub.id)
    }
    this.state.subjectIdList = subjectIds;

    var {jobList, page, pageSize, maxPage} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var jobArr = jobList.slice(firstInd, lastInd)
    var jCards = jobArr.map((job,i) =>
      <div className='col-sm-3' key={i}>
        <div className='card' style={card_remove_border}>
          <JobCard jobId={job.id} name={job.name} company={job.company} image={job.image} provider={job.provider} numCourses={job['num-related-courses']} jobType={job.jobtype} location={job.location}/>
        </div>
      </div>
    )
    return(
      <div className='box'>
        <h1 style={{'fontSize': '96px'}}>Jobs</h1>
        <div className='Filters'>
          <h1 onClick={() => this.setState({filterOpen: !this.state.filterOpen})}>Filters</h1>
          <br />
          <Collapse in={this.state.filterOpen}>
            <div>
              <Select multi options={companyOptions} simpleValue value={this.state.companyOption} placeholder='Company' onChange={this.companyChange} />
              <Select multi options={locationOptions} simpleValue value={this.state.locationOption} placeholder='Location' onChange={this.locationChange} />
              <Select multi options={providerOptions} simpleValue value={this.state.providerOption} placeholder='Provider' onChange={this.providerChange} />
              <Select options={numCourseOptions} simpleValue value={this.state.numCourseOption} placeholder='Number of related courses' onChange={this.numCourseChange} />
              <Select options={typeOptions} simpleValue value={this.state.typeOption} placeholder='Job type' onChange={this.typeChange} />
              <Select options={subjectOptions} simpleValue value={this.state.subjectOption} placeholder='Subject' onChange={this.subjectChange} />
            </div>
          </Collapse>
        </div>
        <br />
        <div className='Sorting'>
          <h1 onClick={() => this.setState({ sortOpen: !this.state.sortOpen})}>Sorting</h1>
          <br />
          <Collapse in={this.state.sortOpen}>
            <Select options={sortOptions} simpleValue value={this.state.sortOption} placeholder='Sort by' onChange={this.sortChange} />
          </Collapse>
        </div>
        <Row className='cards'>
        {jCards}
        </Row>
        <div className='pages' >
        <ReactPaginate
                    initialPage={this.state.page-1}
                    previousLabel={"previous"}
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
export default Jobs;
