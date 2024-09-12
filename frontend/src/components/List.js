import { useState, useEffect } from "react";
import '../styles/modules/list.scss'
import { getClasses } from '../utils/getClasses';
import { MdDelete, MdEdit } from 'react-icons/md';
const iso = require('to-iso-string');
import TodoModal from "./model";
import axios from 'axios';
import toast from 'react-hot-toast';
import CheckButton from "./CheckButton";


function List() {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [tasks, setTasks] = useState([
    {
      title: "",
      status: "",
    },
  ]);
  const [task, setTask] = useState({
    title: "",
    status: "",
    id:'',
  });


  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.json())
      .then((jsonRes) => setTasks(jsonRes));
  }, []);


  const handleCheck =async (id,con) => {
    var status;
    if(con){
      status="incompleted"
    }
    else{
      status="completed"
    }
    try{
      await axios.put(`/updatech/${id}`,{
        status,
    })
    }catch(error){
      toast.error("Error try again")}
    reload()
  };

  var key='';
  const handleUpdate = (e) => {
    var alt = e.currentTarget.getAttribute("alt");
    var name = e.currentTarget.getAttribute("name");
     key = e.currentTarget.getAttribute("id");
    setTask({
      title: name,
      status: alt,
      id:key,
    });
    openmodel()

  };

  const handleDelete = async (e) => {
    var id = e.currentTarget.getAttribute("id");
    console.log(id)
    try{
      await axios.delete(`/delete/${id}`,{})
      toast.success('Task deleted');
    
    }catch(error){
      toast.error("Error try again")}
    reload()

  };

  const reload=()=>{
    window.location.reload(false);
  }
  const openmodel = () => {
    setUpdateModalOpen(true);
  };
const fromat=(date)=>{
  var to = new Date(date);
  var formated=iso(to);
  return new Date(formated).toLocaleString("en-AU")
}

  return (
    <div>
      {tasks
          .sort((a, b) => {
            var titleA = a.createdAt;
            var titleB = b.createdAt;
            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }
          })
          .map((data) => {
            var state=data.status
            var con;
            if(state=="completed"){con=true}
            else if(state=="incompleted"){con=false}
            return(
              <div className="item" >
        <div className="todoDetails">
        <CheckButton key={data._id} id={data._id} checked={con} handleCheck={handleCheck} />
          <div className="texts">
            <p
              className={getClasses([
                "todoText",
                data.status === 'completed' && ['todoText--completed'],
              ])}

            >
              {data.title}
            </p>
            <p className="time">
              {fromat(data.createdAt)}
            </p>
          </div>
        </div>

        <div className="todoActions">
          <div
          key={data.id}
            className="icon"
            id={data._id}
            onClick={handleDelete}
            tabIndex={0}
            role="button"
          >
            <MdDelete />
          </div>
          <div
            className="icon"
            key={data._id}
            id={data._id}
            name={data.title}
            alt={data.status}
            onClick={handleUpdate}
            tabIndex={0}
            role="button"
          >
            <MdEdit />
          </div>
        </div>
      </div>
            )
          })}
          
        <TodoModal
        type="update"
        modalOpen={updateModalOpen}
        setModalOpen={setUpdateModalOpen}
        name={task.title}
        alt={task.status}
        identity={task.id}
      />
    </div>
  );
}

export default List;
