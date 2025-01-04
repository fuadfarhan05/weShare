import React, { useEffect, useState, useCallback } from "react";
import '../App.css';
import { db, auth } from '../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

function Room() {
  const [roomList, setRoomList] = useState([]);
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const [enteredRoomCode, setEnteredRoomCode] = useState("");
  const navigate = useNavigate();

  const roomCollectionRef = collection(db, "rooms");

  const getRoomList = useCallback(async () => {
    try {
      const data = await getDocs(roomCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRoomList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }, [roomCollectionRef]);

  useEffect(() => {
    getRoomList();
  }, [getRoomList]);

  const onSubmitRoom = async () => {
    if (!newRoomTitle) return;
    try {
      // Store the current user's UID as the creator
      await addDoc(roomCollectionRef, {
        title: newRoomTitle,
        creatorUid: auth?.currentUser?.uid, // Store creator UID
        users: [auth?.currentUser?.uid],
      });
      await getRoomList();
      setNewRoomTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRoom = async (id) => {
    try {
      const roomDoc = doc(db, "rooms", id);
      await deleteDoc(roomDoc);
      await getRoomList();
    } catch (err) {
      console.error(err);
    }
  };

  const joinRoom = (id, title, creatorUid) => {
    // If the current user is the creator, let them join without the code
    if (auth?.currentUser?.uid === creatorUid) {
      navigate(`/rooms/${id}`, { state: { roomTitle: title } });
    } else {
      // Other users should enter via code
      console.log("Non-creator users must use the room code.");
    }
  };

  const joinRoomByCode = async () => {
    try {
      if (!enteredRoomCode) {
        console.log("Please enter a room code.");
        return;
      }

      const roomDocRef = doc(db, "rooms", enteredRoomCode);
      const docSnapshot = await getDoc(roomDocRef);

      if (docSnapshot.exists()) {
        const roomData = docSnapshot.data();
        navigate(`/rooms/${enteredRoomCode}`, { state: { roomTitle: roomData.title } });
      } else {
        console.log("Room not found. Please check the code and try again.");
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div>
      <div>
        <h1>Enter Room Code:</h1>
        <input
          placeholder="Enter room code here"
          value={enteredRoomCode}
          onChange={(e) => setEnteredRoomCode(e.target.value)}
        />
        <button className="button" onClick={joinRoomByCode}>
          Join Room
        </button>
      </div>
      <div>
        <h1>Create Your Room's Name:</h1>
        <input
          placeholder="Room name..."
          value={newRoomTitle}
          onChange={(e) => setNewRoomTitle(e.target.value)}
        />
        <button className="button" onClick={onSubmitRoom}>Submit</button>
      </div>
      <div>
        {roomList.length > 0 ? (
          roomList.map((room) => (
            <div key={room.id}>
              <h1>{room.title}</h1>
              <button 
                className="button" 
                onClick={() => joinRoom(room.id, room.title, room.creatorUid)}
              >
                Enter Room
              </button>
              <button className="button" onClick={() => deleteRoom(room.id)}>Delete Room</button>
            </div>
          ))
        ) : (
          <p>No rooms available.</p>
        )}
      </div>
    </div>
  );
}

export default Room;
