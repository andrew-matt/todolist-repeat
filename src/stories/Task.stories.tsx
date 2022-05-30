import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task} from "../Task";

export default {
    title: 'Todolist/Task',
    component: Task,
    args: {
        todolistId: 'todolistId1',
        changeTaskStatus: action('changeTaskStatus'),
        changeTaskTitle: action('changeTaskTitle'),
        removeTask: action('removeTask')
    }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
TaskIsDoneStory.args = {
    task: {id: '1', isDone: true, title: 'JS'},
};

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
    task: {id: '2', isDone: false, title: 'CSS'},
};
