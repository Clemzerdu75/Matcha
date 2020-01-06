  import React from 'react';
  import ReactDOM from 'react-dom';
  import * as io from 'socket.io-client'
  import SocketContext from './socketContext'

  import Matcha from './components/Matcha';
  import './index.css';
  
  console.log = console.warn = console.error = () => {};
  const socket = io('http://localhost:8081', {query: {pseudo:window.localStorage.pseudo}})

 ReactDOM.render(
    <SocketContext.Provider value={socket}>
      <Matcha />
    </SocketContext.Provider>
    , document.getElementById("root")
  );
