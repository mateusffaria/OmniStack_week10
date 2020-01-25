import React, { useEffect, useState } from 'react';
import api from './services/api';
import DevItem from './components/DevItem/index';
import DevForm from './components/components/DevForm/index';

import './global.css';
import './App.css';
import './Main.css';
import './Sidebar.css';

function App() {
  const [devs, setDevs] = useState([]);

  async function loadDevs(){
    const response = await api.get('/devs');

    setDevs(response.data);
  }

  loadDevs();

  useEffect(() => {

  }, []);

  async function handleDevAdd(data){
    const response = await api.post('/devs', data)

    setDevs([... devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Register</strong>
        <DevForm onSubmit={handleDevAdd} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem onClick={loadDevs} key={dev._id} dev={dev}/>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;