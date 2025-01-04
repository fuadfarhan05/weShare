import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db, auth } from '../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, query, where } from "firebase/firestore";
import '../App.css';

function RoomPage() {
  const location = useLocation();
  const { roomTitle } = location.state || {}; // Get room title from location state

  const [taskList, setTaskList] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [roomCode, setRoomCode] = useState(""); // State for the room code

  const tasksCollectionRef = collection(db, "tasks");

  // Fetch the document ID of the room based on the title
  const getDocId = async () => {
    try {
      const roomsCollectionRef = collection(db, "rooms");
      const q = query(roomsCollectionRef, where("title", "==", roomTitle)); // Assuming rooms have a "title" field
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id; // Get the first matching document ID
        setRoomCode(docId); // Set the room code state
      } else {
        console.log("No matching room found.");
      }
    } catch (error) {
      console.error("Error retrieving document ID:", error);
    }
  };

  // Fetch tasks from the tasks collection filtered by room
  const getTaskList = async () => {
    try {
      const q = query(tasksCollectionRef, where("roomId", "==", roomTitle)); // Filter by room
      const data = await getDocs(q);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTaskList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (roomTitle) {
      getTaskList();
      getDocId(); // Fetch the room document ID
    }
  }, [roomTitle]);

  const onSubmitTask = async () => {
    if (!newTaskTitle) return;
    try {
      await addDoc(tasksCollectionRef, {
        title: newTaskTitle,
        userId: auth?.currentUser?.uid,
        roomId: roomTitle, // Associate task with room
      });

      getTaskList();
      setNewTaskTitle(""); // Clear input after submitting task
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
      getTaskList();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskTitle = async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, { title: updatedTitle });
      getTaskList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Welcome to {roomTitle || "the room"}</h1>
      <h2>The room code is: {roomCode || "Loading..."}</h2>

      {/* Add Task Section */}
      <div>
        <h2>What are you currently busy with?:</h2>
        <input
          placeholder="Task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button className="button" onClick={onSubmitTask}>Submit</button>
      </div>

      {/* Task List Section */}
      <div>
        {taskList.length > 0 ? (
          taskList.map((task) => (
            <div key={task.id}>
              <h2>{task.title}</h2>
              <button className="button" onClick={() => deleteTask(task.id)}>
                Delete Task
              </button>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
}

export default RoomPage;
