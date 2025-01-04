import { auth, googleProvider, fireObject } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from "react"; 
import '../App.css';


export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email)


    const signIn = async () => {
        try{
        await createUserWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try{
        await signInWithPopup(auth, googleProvider)
        } catch (err) {
            console.error(err);
            console.log('testing', fireObject);
        }
    };


    const logout = async () => {
        try{
        await signOut(auth)
        } catch (err) {
            console.error(err);
        }
    };

    





    return (
    <div>
    <input className ="box" placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
        />
    <input className ="box" placeholder="Password..."
        type = "password"
        onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" onClick={signIn}>Sign In</button>

        <button className="button" onClick={signInWithGoogle}>Sign In with Google</button>
    
    <button onClick={logout}> Log Out</button>
    
    </div>
    );
};