import * as React from 'react';
import Taskcard from './Taskcard';
import Taskboard from './Taskboard';
import './Taskmainpage.css';

export default function Taskmainpage(props) {
    
    return(
      <div>
        <main className='flexbox'>
        
          <Taskboard id="board-1" className="board">
            <Taskcard id="card-1" className="card" draggable="true">
              <p>Card one</p>
            </Taskcard>
            <Taskcard id="card-3" className="card" draggable="true">
              <p>Card three</p>
            </Taskcard>
          </Taskboard>  
          <Taskboard id="board-2" className="board">
            <Taskcard id="card-2" className="card" draggable="true">
              <p>Card two</p>
            </Taskcard>
            <Taskcard id="card-4" className="card" draggable="true">
              <p>Card four</p>
            </Taskcard>
          </Taskboard>
        </main>
      </div>      
    );
}