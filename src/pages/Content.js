import React from "react";
import { useEffect, useState } from "react";
import '../App.css';
import { db, auth } from '../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, } from 'firebase/firestore';



function Content() {
  const [taskList, setTaskList] = useState([]);

  // New tasks states
  const [newTaskTitle, setNewTaskTitle] = useState("");

  //title state
  const [updatedTitle, setUpdatedTitle] = useState("");

  const taskCollectionRef = collection(db, "tasks");


  const getTaskList = async () => {
    try{
    const data = await getDocs(taskCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setTaskList(filteredData);
    } catch (err){
      console.error(err);
    }
};

  useEffect(() => {
    getTaskList();
  },);

  

  const onSubmitTask = async () => {
    try {
    await addDoc(taskCollectionRef, 
      {title: newTaskTitle,
       userId: auth?.currentUser?.uid,
      
      });
      getTaskList();
    } catch(err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
     const taskDoc = doc(db, "tasks" , id);
     await deleteDoc(taskDoc);
     getTaskList();
  };



  const updateTaskTitle = async (id) => {
    const taskDoc = doc(db, "tasks" , id);
    await updateDoc(taskDoc, {title: updatedTitle});
    getTaskList();

 };

 
  
  return ( <div>

    <div>
    <h3>here is a demo on how it works!</h3>
      <h1>What are you currently busy with?:</h1>
      <input placeholder="task..." 
      onChange={(e) => setNewTaskTitle(e.target.value)}
      /> 
      <button className="button" onClick={onSubmitTask}> Submit </button>
    </div>

    <div>
      {taskList.map((tasks) => (
        <div>
          <h1>{tasks.title}</h1>

          <input placeholder = "edit..." 
          onChange={(e) => setUpdatedTitle(e.target.value)}/>
          <button className="button" onClick = {() => deleteTask(tasks.id)}>Delete Task</button>
          <button className="button" onClick = {() => updateTaskTitle(tasks.id)} >edit</button>

        </div>



      ))}
    </div>

  </div>
  );
}

export default Content;