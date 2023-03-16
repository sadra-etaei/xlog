// import './App.css';
import { HashRouter , Router, Route, Routes} from "react-router-dom";
import React from 'react';
import Base from "./pages/base"
import Home from "./pages/home"
import Create from "./pages/create"
import Drafts from "./pages/drafts"
import Profile from "./pages/profile"
import Topics from "./pages/topics"
import PostPage from "./pages/postPage"
import UserProfile from './pages/userProfile';
import SignUp from './pages/signup';
import Login from './pages/login';
import Update from './pages/update';
import Saved from './pages/saved';
import LandingPage from './landing';

function App() {
  return (
    <HashRouter >
      <Routes>
        <Route path='/' element={<Base />} >
          <Route index element={<LandingPage />} />
          <Route path='home' element={<Home/>} />
          <Route path='create' element={<Create />} />
          <Route path='topics' element={<Topics />} />
          <Route path='drafts' element={<Drafts />} />
          <Route path="profile/:pk" element={<Profile />} />
          <Route path="/posts/:pk" element={<PostPage/>} />
          <Route path='/users/:pk' element={<UserProfile/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path="/login" element={<Login/>} />
          <Route path='/update/:pk' element={<Update/>}/>
          <Route path='/saved/' element={<Saved/>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App