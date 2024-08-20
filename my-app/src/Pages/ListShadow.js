import { connect } from 'react-redux';
import List from './List';
import React from 'react';

export class ListComponent extends React.Component {
    constructor(){
        super();
        this.dataToSend = this.dataToSend.bind();
    }
    dataToSend(){
        return {todos: this.props.todos};
    }

    render(){
        console.log(this.props)
        return (
            <div>
              <ConnectedList
                todoToEdit={this.props.todoToEdit}
                todos={this.props.todos}
                message={this.props.message}
                updatedTodos={ this.props.todosUpdate }
                dataFromListComponent={this.props}/>
            </div>
          );
    }
}

const mapStateToProps = state => ({
  // Map relevant state to props
});

const ConnectedList = connect(mapStateToProps)(List);

export default ListComponent;