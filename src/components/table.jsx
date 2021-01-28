import React, { Component } from "react";
import Table from "react-table-6";


class _Table extends Component {

    constructor(props){
        super(props);
        this.state = {
          headers : [{  
            Header: 'ID',  
            accessor: '_id'  
            },{  
            Header: 'Имя задачи',
            accessor: 'name'
            },{  
             Header: 'Дата начала',
             accessor: 'birthDate',
             Cell: props  =>{
              return(
                new Date(props.original.birthDate).toLocaleString()
              )
            }             
           },{  
             Header: 'Статус',
             accessor: 'status'  
           },{  
             Header: 'Deadline',  
             accessor: 'deathDate',
             Cell: props  =>{
              if(props.original.deathDate)
                return(
                  new Date(props.original.deathDate).toLocaleString()
                )
            }   
           },{  
             Header: 'Прикреплённый файл',
             Cell: props  =>{
               return(
                 <a href={`http://localhost:8082/task/file/${props.original.fileName}`} target="_blank">{props.original.fileName}</a>
               )
             }
           },{  
             Header: 'Действие',
             Cell: shit=>{
              return (
                <div>
                  <button className="btn btn-secondary btn-sm mr-2" onClick={this._onDelete.bind(this,shit.original._id)}>
                    <span className="glyphicon glyphicon-remove"></span>  
                    Удалить
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={this._onEditClick.bind(this,shit.original)}>
                    <span className="glyphicon glyphicon-pencil"></span>
                    Редактировать
                  </button>
                </div>
              )
            } 
           }]          
      }  
    }

    _onDelete(id){
      this.props.onDelete(id)
    }

    _onEditClick(task){
      this.props.onEditClick(task);
    }

    render() {
        return (
          <Table 
          data={this.props.data} 
          columns={this.state.headers}  
          defaultPageSize = {6}  
          pageSizeOptions = {[2,4, 6]}  
      /> 
    );
  }
}
export default _Table;
