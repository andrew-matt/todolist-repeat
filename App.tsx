import React, {useState} from 'react';
import './App.css';
import Todolist, {TaskType} from "./Todolist";

function App() {
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "JS/TS", isDone: true},
])

    const removeTask = (taskID: number) => {
        const filteredTasks = tasks.filter(task => task.id !== taskID)
        setTasks(filteredTasks)
    }

    return (
        <div className="App">
            <Todolist
                title={"What to learn"}
                tasks={tasks}
                removeTask={removeTask}/>
        </div>
    );
}

export default App;
