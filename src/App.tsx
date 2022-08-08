import React from 'react';
import './styles/App.scss';
import RouteHandler from './Components/RouteHandler';
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import Layout from './Pages/Layout';
import CardsContainer from './Components/CardsContainer';
import Cart from './Components/Cart';
import MyWidgets from './Pages/MyWidgets';
import ProfilePage from './Pages/ProfilePage';
import AllWidgets from './Components/AllWidgets';

function App() {

  return (
    <div className="App">
      <RouteHandler/>
    </div>
  );
}

export default App;