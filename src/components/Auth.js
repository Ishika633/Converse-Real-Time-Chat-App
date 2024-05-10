import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export function Auth() {
  const [Name, setName] = useState("");
  const [rr, setrr] = useState("none");

  const dispatch = useDispatch();

  const { username } = useSelector((state) => {
    return state;
  });
  
  useEffect(() => {
    dispatch({ type: "username_change", payload: Name });
  }, [Name]);
  // useState
  // console.log(username);

  const signin = async () => {
    try {
      setrr("none");
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };
  const tomper = () => {
    console.log(rr);
    setrr("block");
    setTimeout(() => {
      setrr("none");
      
    }, 1500);
  };
  
  return (
    <div style={{ fontFamily: "Poppins", color: "white" }}>
      <div style={{
        textAlign: "left",
        fontSize: "50px",
        padding: "20px 10px",
        marginBottom: "20px",
        backgroundColor: "inherit",
        fontStyle: "italic",
        fontWeight: "400",
        // background: '-webkit-linear-gradient(#481E14, #D1BB9E)',
        // WebkitBackgroundClip: 'text',
        // WebkitTextFillColor: 'transparent',
      }}>
        Converse
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="Diver"
          style={{
            textAlign: "center",
            color: "#CCCCCC",
            fontSize: "25px",
            maxWidth: "100%",
            maxHeight:"100%"
          }}
        >
          <h1 style={{ marginBottom: "35px", marginTop: "25%", color: "black", fontSize: "50px", fontFamily: "Poppins", fontWeight: "700", fontStyle: "italic" }}>Connect and Chat</h1>
          <div style={{ color: "red", display: `${rr}`, marginBottom: "10px" }}>
            Please Provide a Name
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              className="rounded-md"
              placeholder="Avatar Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={Name}
              style={{ height: "50px", width: "100%", padding: "0 15px" }}
            />
          </div>
          <button
            className="rounded"
            style={{
              width: "100%",
              backgroundColor: "#436850",
              padding: "10px 20px",
              borderRadius: "8px",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderBottom: "none",
              marginBottom: "320px"
            }}
            onClick={Name !== "" ? signin : tomper}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
