import React, { useState, useEffect } from 'react'
import './styles.css'

function DevForm({ onSubmit }) {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
  
    const [github_username, setGithub_username] = useState('');
    const [techs, setTechs] = useState('');    

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            setLatitude(latitude);
            setLongitude(longitude);
          },
          (err) =>{
            console.log(err);
            
          },
          {
            timeout: 30000,
          }
        );
      }, []);

    async function handleSubmit(e) {
      e.preventDefault();
      await onSubmit({
        github_username,
        techs,
        latitude,
        longitude
      }              
    );

      setGithub_username('');
      setTechs('');
    }

    return(
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="github_username">Github Username</label>
            <input 
              name="github_username" 
              id="github_username" 
              required
              value={github_username}
              onChange={e => setGithub_username(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="techs">Techs</label>
            <input 
              name="techs" 
              id="techs" 
              required
              value={techs}
              onChange={e => setTechs(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input 
                type='number' 
                name="latitude" 
                id="latitude" 
                value={latitude} 
                required
                onChange={e => setLatitude(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input 
                type='number' 
                name="longitude" 
                id="longitude" 
                value={longitude} 
                required
                onChange={e => setLongitude(e.target.value)}
              />
            </div>           
          </div>
          <button type="submit">Save</button>
        </form>        
    )
};

export default DevForm;