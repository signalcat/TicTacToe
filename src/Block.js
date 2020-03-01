import React from 'react';
import style from './style.module.css';
const Block = (props) => {
    return (
        <div className={style.square} onClick={props.clicked}>{props.mark}</div>
    );  
};

export default Block;
