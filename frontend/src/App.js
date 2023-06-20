import 'tailwindcss/tailwind.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Results from './components/Results';
import Question from './components/Question';
import AddQuestion from './components/AddQuestion';
import UserProfile from './components/UserProfile';
import LoggedProfile from './components/LoggedProfile';
import Login from './components/Login';
import SignUp from './components/SignUp';


import { useState } from 'react';
function App() {
  const [search, setSearch] = useState("")  
  return (
    <BrowserRouter>
      <Routes>
        <Route element ={<Home search = {search} setSearch={setSearch}/>} path="/"/>
        <Route element ={<Results search = {search} setSearch={setSearch}/>} path="/search/:query" />
        <Route element ={<Question search = {search} setSearch={setSearch}/>} path="/question/:id" />
        <Route element ={<AddQuestion search = {search} setSearch={setSearch}/>} path="/question/add" />
        <Route element ={<AddQuestion search = {search} setSearch={setSearch}/>} path="/question/add/:query" />
        <Route element ={<LoggedProfile search = {search} setSearch={setSearch}/>} path="/profile/" />
        <Route element ={<UserProfile search = {search} setSearch={setSearch}/>} path="/profile/:pk" />
        <Route element ={<Login search = {search} setSearch={setSearch}/>} path="/login/" />
        <Route element ={<SignUp search = {search} setSearch={setSearch}/>} path="/signup/" />


      </Routes>
    </BrowserRouter>
    
  );
}
export default App;
