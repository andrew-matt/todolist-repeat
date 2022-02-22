import React from 'react';
import {FilterValuesType} from "./App";

type ControlButtonsType = {
    changeFilter: (filter: FilterValuesType) => void
    filter: FilterValuesType
}

const ControlButtons = (props: ControlButtonsType) => {
    const onClickSetFilter = (filter: FilterValuesType) => {
        return () => props.changeFilter(filter)
    }
    return (
        <span>
            <button
                className={props.filter === "all" ? "button-active" : ""}
                onClick={onClickSetFilter("all")}>All</button>
            <button
                className={props.filter === "active" ? "button-active" : ""}
                onClick={onClickSetFilter("active")}>Active</button>
            <button
                className={props.filter === "completed" ? "button-active" : ""}
                onClick={onClickSetFilter("completed")}>Completed</button>
        </span>
    );
};

export default ControlButtons;