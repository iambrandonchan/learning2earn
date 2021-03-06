import React, { Component } from 'react';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import MyNavbar from './components/MyNavbar.jsx';
import Jobs from './components/Jobs.jsx';
import Courses from './components/Courses.jsx';
import Subjects from './components/Subjects.jsx';
import CourseData from './components/CourseData.jsx'
import SubjectData from './components/SubjectData.jsx'
import JobData from './components/JobData.jsx'
import SearchLanding from './components/SearchLanding.jsx'
import SearchPage from './components/SearchPage.jsx'
import Visualization from './components/Visualization.jsx'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <MyNavbar/>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/jobs' component={Jobs} />
          <Route exact path='/courses' component={Courses} />
          <Route exact path='/subjects' component={Subjects} />
          <Route path='/courses/:id' component={CourseData}/>
          <Route path='/subjects/:id' component={SubjectData}/>
          <Route path='/jobs/:id' component={JobData} />
          <Route exact path='/Viz' component={Visualization} />
          <Route exact path='/search/' component={SearchLanding} />
          <Route exact path='/search/:query' component={SearchPage} />
          <Route path='/searche' component={SearchLanding} />
        </div>
    </Router>
    );
  }
}
export default App;
