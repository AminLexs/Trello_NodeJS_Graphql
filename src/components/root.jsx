import React, { Component } from "react";
import Table  from "./table"
import Editor from "./editor"
import Filter from "./filter"
import CreateForm from "./createForm"
import Store from "../store/taskStore"
import NavBar from "./navBar"
import Modal from "./modal"
import TaskAction from "../action/taskAction"

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from "apollo-upload-client";

const link = createUploadLink({ uri: "http://localhost:8082/graphql",  credentials: 'include'});



const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
  // credentials: 'include',
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    }
  }
});

class Root extends Component {
  
  constructor(props){
    const info = getStateFromFlux();
    super(props)
    this.state={
      tasks: info.tasks,
      editingTask: info.editingTask,
      isLoginModalOpen: false,
      isRegisterModalOpen: false
    }
    this._onChange=this._onChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.error =  this.error.bind(this);
  }

  componentWillMount() {
    TaskAction.getTasksQL("");
  }

  componentDidMount() {
    Store.addChangeListener(this._onChange, this.error);
    Store.emitChange();
  }

  componentWillUnmount() {
    Store.removeChangeListener(this._onChange, this.error);
  }

  _onChange() {
    this.setState(getStateFromFlux());
  }

  error(){
    let err = Store.getError();
    if(err.status === 401){
      this.setState({isOpenModal : true})
    }
  }

  handleGettingTasks(status){
    TaskAction.getTasksQL(status);
  }

  handleDeleting(id){
    TaskAction.deleteTaskQL(id);
  }

  handleCreating(data){
    TaskAction.createTaskQL(data);
  }

  handleEditing(taskData){
    TaskAction.updateTaskQL(taskData);
  }

  handleChoosingTaskFromTable(task){
    TaskAction.choseTaskFromTable(task);
  }

  cancleEditing(){
    TaskAction.clearEditingTask();
  }

  openModal() {
    this.setState({isOpenModal : true})
  }
 
  afterOpenModal() {
  }
 
  closeModal(){
    this.setState({isOpenModal : false})
  }

  render() {
    var editor;
    if(this.state.editingTask)
      editor=<Editor task={this.state.editingTask} cancelFnc={this.cancleEditing} onSaveEdit={this.handleEditing}/>
    return (
        <div>
            <Modal
              isOpen={this.state.isOpenModal}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              contentLabel="Login"
              closeModal={this.closeModal}
              appElement={document.getElementById('root')}
            >
            </Modal>

          <NavBar 
            login={this.openModal}
          />

          <CreateForm 
            onCreate={this.handleCreating}
          />
          {editor}
          <Filter 
            onFiltering={this.handleGettingTasks}
          />

          <Table  
            data={this.state.tasks}
            onDelete={this.handleDeleting}
            onEditClick={this.handleChoosingTaskFromTable}   
          /> 

        </div>
    );
  }
}
 
function getStateFromFlux() {
  return {
      tasks: Store.getTasks(),
      editingTask: Store.isEditing()
  };
}

export { Root, client };