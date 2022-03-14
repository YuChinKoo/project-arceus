import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';

export default function Taskcard(props) {
    const dragStart = e => {
        const target = e.target;

        e.dataTransfer.setData('card_id', target.id);
        
        setTimeout(() => {
            target.style.display = "none";
        }, 0);
    }
    
    const dragOver = e => {
        e.stopPropagation();
    }
    return(
      <div
        id={props.id}
        onDragStart={dragStart}
        onDragOver={dragOver}
        draggable={props.draggable}
        className={props.className}
      >
        <Card>
            <CardContent>
                {props.children}
            </CardContent>   
        </Card>   
      </div>    
    );
}