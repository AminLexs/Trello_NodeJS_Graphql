import { gql } from '@apollo/client';

const getTasks = gql`
    query GetQuery($status: String) {
        getQuery: getTasks(status: $status){
            code
            obj{
            id
            status
            fileName
            deathDate
            birthDate
            name
            }
        }
    }`

const updateTask = gql`
    mutation UpdateMutation($task: TaskInput!) {
        updateMutation: updateTask(task: $task){
            code
            obj{
            id
            status
            fileName
            deathDate
            birthDate
            name
            }
        }
    }`

const deleteTask = gql`
    mutation DeleteMutatipn($id: String!) {
        deleteMutation: deleteTask(id: $id){
            code
            obj{
            id
            status
            fileName
            deathDate
            birthDate
            name
            }
        }
    }`

const createTask = gql`
    mutation CreateMutation($name: String!) {
        createMutation: createTask(name: $name){
            code
            obj{
            id
            status
            fileName
            deathDate
            birthDate
            name
            }
        }
    }`

const uploadFile = gql`
    mutation UploadFile($file: Upload!, $fileName: String!) {
        uploadFile(file: $file, fileName: $fileName){
            code
        }
    }`;
export { getTasks, updateTask, deleteTask, createTask, uploadFile };