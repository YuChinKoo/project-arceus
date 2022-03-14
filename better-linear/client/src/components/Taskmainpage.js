import * as React from 'react';
import {useEffect, useState} from 'react';
import Taskcard from './Taskcard';
import Taskboard from './Taskboard';
import DragNDrop from './DragAndDrop';
import './Taskmainpage.css';
import './DragAndDrop.css';

const defaultData = [
    {title: 'group 1', items: ['1', '2', '3']},
    {title: 'group 2', items: ['4', '5']}
]

export default function Taskmainpage(props) {
    const [data, setData] = useState();
    useEffect(() => {
        if (localStorage.getItem('List')) {
          console.log(localStorage.getItem('List'))
          setData(JSON.parse(localStorage.getItem('List')))
        } else {
          setData(defaultData)
        }
      }, [setData])

    return(
    //   <div>
    //     <main className='flexbox'>
        
    //       <Taskboard id="board-1" className="board">
    //         <Taskcard id="card-1" className="card" draggable="true">
    //           <p>Card one</p>
    //         </Taskcard>
    //         <Taskcard id="card-3" className="card" draggable="true">
    //           <p>Card three</p>
    //         </Taskcard>
    //       </Taskboard>  
    //       <Taskboard id="board-2" className="board">
    //         <Taskcard id="card-2" className="card" draggable="true">
    //           <p>Card two</p>
    //         </Taskcard>
    //         <Taskcard id="card-4" className="card" draggable="true">
    //           <p>Card four</p>
    //         </Taskcard>
    //       </Taskboard>
    //     </main>
    //   </div> 
      <div className='App'>
        <header className='App-header'>
            <DragNDrop data={data}></DragNDrop>
        </header>
          
      </div> 
    );
}