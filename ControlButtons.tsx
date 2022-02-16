import React from 'react';
import {FilterValuesType} from "./App";

type ControlButtonsType = {
    changeFilter: (filter: FilterValuesType) => void
}

const ControlButtons = (props: ControlButtonsType) => {
    const onClickSetFilter = (filter: FilterValuesType) => {
        return () => props.changeFilter(filter)
    }
    return (
        <span>
            <button onClick={onClickSetFilter("all")}>All</button>
            <button onClick={onClickSetFilter("active")}>Active</button>
            <button onClick={onClickSetFilter("completed")}>Completed</button>
        </span>
    );
};

export default ControlButtons;