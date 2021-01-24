import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home'
import CandidateUpload from './components/CandidateUpload/CandidateUpload';
import Profile from './components/Profile/Profile';
import VotingPage from './components/VotingPage/VotingPage';
import ViewResults from './components/ViewResults/ViewResults';
import EditProfile from './components/EditProfile/EditProfile';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
        <Route path = "/signup" component = {Signup}/>
        <Route path = "/home" component = {Home}/>
        <Route path = "/uploadCandidateData" component = {CandidateUpload}/>
        <Route path = "/viewResults" component = {ViewResults}/>
        <Route path = "/profile" component = {Profile}/>
        <Route path = "/editProfile" component = {EditProfile}/>
        <Route path = "/votingpage" component = {VotingPage}/>
        <Route path = "/forgotPassword" component = {ForgotPassword}/>
        <Route path = "/resetPassword" component = {ResetPassword}/>
        <Route path = "/" component = {Login}/>
        <Redirect to = "/"/>
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
