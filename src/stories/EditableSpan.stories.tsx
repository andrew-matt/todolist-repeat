import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {EditableSpan} from "../EditableSpan";

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanStory = Template.bind({});
EditableSpanStory.args = {
    value: "123",
    onChange: action('EditableSpan value changed')
};
