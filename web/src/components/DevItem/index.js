import React from 'react'
import './styles.css'
import api from '../../services/api';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css' 

function DevItem({ dev }) {

  const options = {
    title: 'Title',
    message: 'Message',
    buttons: [
      {
        label: 'Yes',
        onClick: () => alert('Click Yes')
      },
      {
        label: 'No',
        onClick: () => alert('Click No')
      }
    ],
    childrenElement: () => <div />,
    customUI: ({ title, message, onClose, buttons }) =>
      <div className='custom-ui'>
        <h1>Are you sure?</h1>
        <p>You want to delete this file?</p>
        <button onClick={onClose}>No</button>
        <button onClick={() => {
            handleDelete();
            onClose()
        }}>Yes, Delete it!</button>
      </div>,
    willUnmount: () => {}
  }

  function alert(e) {
    e.preventDefault();
    confirmAlert(options);
  }

  async function handleDelete() {
    const response = await api.delete(`/devs/${dev.github_username}`,{} 
    );
  };

  return(
      <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.name}/>
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(', ')}</span>
        </div>
      </header>
      <p>{dev.bio}</p>
      <div className="icons">
        <div className="icons">
          <img src="https://png2.cleanpng.com/sh/7408f378d05821534d0b119ea5397f2f/L0KzQYm3WMI1N5D6fZH0aYP2gLBuTfNwdaF6jNd7LXnmf7B6Tfxwb5CyiNH7dHHlfLa0jvV1f5D3g59wcnHzeLrqk71kdJp1Rdtsb372Pbf2kr1nepZqRdtsb379cX7qigJkdJYyi9HsaXHvPYbpVBZmPGdnTNdsOEG6PoO3WMAyPGM7Sac8NUGzSIO3U8MzOmgziNDw/kisspng-computer-icons-logo-portable-network-graphics-clip-icons-for-free-iconza-circle-social-5b7fe46b4ec817.2080142615351082033227.png" alt="github_icon" className='iconGithub'/>
          <a href={`https://github.com/${dev.github_username}`}>Github profile</a>
        </div>
        <div className="iconEditDelete">
          <a className="icon" href={`/devs/${dev.github_username}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/></svg>
          </a>
            
          <a onClick={alert} href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/></svg>
          </a>
        </div>
      </div>
    </li>
  );
}

export default DevItem;