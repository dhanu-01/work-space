// import React from 'react'
import './App.css';
import Navs from './Navs';
import { UserContextProvider } from './context/userContext';
import 'react-notifications-component/dist/theme.css'
import { ReactNotifications } from 'react-notifications-component'


const App = () => {


  return (
    <div className='App'>
     <UserContextProvider>
     <ReactNotifications />
     <Navs/>
     </UserContextProvider>
    </div>
  )
}

export default App