import Dispatcher from "../dispatcher/dispatcher";
import actionTypes from "./types";
import { client } from '../components/root'

import { getTasks, updateTask, deleteTask, createTask, uploadFile } from "../gql/taskQL";

const TaskActions = {

    getTasksQL(status) {
        client.query({
            query: getTasks,
            variables: { status },
        })
            .then(res => {
                console.log(res)
                Dispatcher.dispatch({
                    type: actionTypes.REQUEST_SUCCESS,
                    tasks: res.data.getQuery.obj
                })
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 2))
            });
    },

    deleteTaskQL(_id) {
        client.mutate({
            mutation: deleteTask,
            variables: { id: _id }
        })
            .then(res => {
                console.log(res);
                this.getTasksQL("");
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 2))
                if (err.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED')
                    alert('Authoraze please')
            })
    },

    createTaskQL(_data) {
        client.mutate({
            mutation: createTask,
            variables: { name: _data.task_name }
        })
            .then(res => {
                console.log(res);
                this.getTasksQL("");
            })
            .catch(err => {
                if (err.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED')
                    alert('Authoraze please')
                console.log(JSON.stringify(err, null, 2))
            })
    },

    choseTaskFromTable(task) {
        Dispatcher.dispatch({
            type: actionTypes.CHOOSE_TASK,
            editingTask: task
        });
    },

    clearEditingTask() {
        Dispatcher.dispatch({
            type: actionTypes.CLEAR_TASK,
        });
    },

    updateTaskQL(taskData) {
        this.clearEditingTask();
        let taskInput = {
            id: taskData._id,
            name: taskData.name,
            deathDate: new Date(taskData.deathDate),
            status: taskData.status,
            fileName: taskData.file ? taskData.file.name : ""
        };

        if (taskData.prev_file)
            taskInput.prev_file = taskData.prev_file
        if (taskData.deleteFlag)
            taskInput.deleteFlag = taskData.deleteFlag

        client.mutate({
            mutation: updateTask,
            variables: { task: taskInput }
        })
            .then(res => {
                if (taskData.file)
                    this.uploadFile(taskData.file, res.data.updateMutation.obj[0].fileName)
                this.getTasksQL("");
            })
            .catch(err => {
                if (err.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED')
                    alert('Authoraze please')
                console.log(JSON.stringify(err, null, 2))
            })
    },

    uploadFile(file, fileName) {
        console.log(fileName)
        client.mutate({
            mutation: uploadFile,
            variables: { file: file, fileName: fileName }
        })
            .then(res => {
                console.log(res);
                //  this.getTasksQL("");
            })
            .catch(err => {
                if (err.networkError.errors[0].extensions.code === 'UNAUTHENTICATED')
                    alert('Authoraze please')
                console.log(JSON.stringify(err))
                console.log(err.networkError.errors[0].extensions.code === 'UNAUTHENTICATED')
                console.log(err.networkError.errors[0].extensions.code)
                console.log(JSON.stringify(err, null, 2))
            })
    }
}

export default TaskActions;