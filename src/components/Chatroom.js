import { useEffect, useState } from "react";
import { db, googleProvider, auth, storage } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  uid,
  // onValue,
  // ref,
} from "firebase/firestore";
import { where } from "firebase/firestore";
import bin from "./bin.png";
import { onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import style from "../App.css";
import { useSelector } from "react-redux";
import { Link, Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import downer from "./downer.png";
import { getDatabase, onValue, get } from "firebase/database";

import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";

export default function Chatroom() {
  //   const handleFireBaseUpload = e => {
  //     e.preventDefault()
  //   console.log('start of upload')
  //   // async magic goes here...
  //   if(imageAsFile === '') {
  //     console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
  //   }
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const imagesListRef = ref(storage, "images/");

  const uploadFile = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
    const ans = Number(new Date());
    const Dater = new Date().toLocaleString();
    try {
      await addDoc(messagesCollectionRef, {
        createdAt: ans,
        desc: "",
        Imgurl: imageUrls[imageUrls.length - 1],
        userId: auth?.currentUser?.uid,
        type: newId,
        Date: Dater,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   listAll(imagesListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageUrls((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);

  const params = useParams();
  const id = params.id;
  let newId = "";
  for (let ip = 0; ip < id.length; ip++) {
    if (id[ip] >= "0" && id[ip] <= "9") newId += id[ip];
  }

  const [messageList, setmessageList] = useState([]);
  const [CopySuccess, setCopySuccess] = useState("none");
  const [NewmessageList, setNewmessageList] = useState([]);

  const [photourl, setphotourl] = useState("");
  const messagesCollectionRef = collection(db, "messages");
  const { username } = useSelector((state) => {
    return state;
  });
  const [value, setvalue] = useState(0);
  const [DocId, setDocId] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("chal rha",auth.currentUser.uid)
    if (auth.currentUser==null) navigate("/");
  }, [])
  
  const createmessage = async (e) => {
    e.preventDefault();
    if (Input != "") {
      setinputer("");
      const ans = Number(new Date());

      const Dater = new Date().toLocaleString();
      try {
        await addDoc(messagesCollectionRef, {
          createdAt: ans,
          desc: Input,
          url: photourl,
          name: username,
          userId: auth?.currentUser?.uid,
          type: newId,
          Date: Dater,
        });
        // getNewMessageList();
        getMessageList();
        window.scrollTo({ left: 0, bottom: 0, behavior: "smooth" });
        document
          .getElementById("dummy")
          .scrollIntoView(false, { behaviour: "smooth" });
      } catch (err) {
        console.error(err);
      }
    }
    // }
  };

  const getMessageList = async () => {
    try {
      const q = query(messagesCollectionRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let filteredDocerData = [];
      const newList = filteredData.filter((e) => {
        return e.type == newId;
      });

      setmessageList(newList.reverse());
      data.docs.forEach((ele) => {
        filteredDocerData.push(ele.id);
      });

      setDocId(filteredDocerData.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMessageList();
    getNewMessageList();

    const user = auth.currentUser;

    if (user != null) {
      if (user.photoURL != null) setphotourl(user.photoURL);
      else
        setphotourl(
          "https://th.bing.com/th/id/OIP.zBut8QVH36Vn_Mn84OznCAHaHa?pid=ImgDet&rs=1"
        );
    }
  }, []);

  const deleter = async (val) => {
    let ans = window.confirm("Really Want to Delete it ! ");
    if (ans == true) {
      await deleteDoc(doc(messagesCollectionRef, messageList[val - 1].id));
      getMessageList();
    }
  };

  const [Input, setInput] = useState("");

  const logout = async () => {
    try {
      // redirect("/");
      navigate("/");
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };
  const [inputer, setinputer] = useState("");
  const handleinput = (e) => {
    setInput(e.target.value);
    setinputer(e.target.value);
    e.preventDefault();
  };

  const getNewMessageList = async () => {
    try {
      const q = query(collection(db, "messages"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          if (newId == doc.data().type) cities.push(doc.data().desc);
        });
        // console.log("Current cities in CA: ", cities);
        setNewmessageList(cities);
      });
    } catch (err) {
      console.error(err);
    }
  };

  // setTimeout(() => {
  // const qe = query(collection(db, "messages"));
  // const unsubscribe = onSnapshot(qe, (querySnapshot) => {
  //   const cities = [];
  //   querySnapshot.forEach((doc) => {
  //     if (newId == doc.data().type) cities.push(doc.data().desc);
  //   });
  //   if (messageList.length!=NewmessageList) getMessageList();
  // });
  // }, 12000);

  const handleImageClick = () => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    window.scrollTo({ left: 0, bottom: 0, behavior: "smooth" });
    document
      .getElementById("dummy")
      .scrollIntoView(false, { behaviour: "smooth" });
  };

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess("block");
      setTimeout(() => {
        setCopySuccess("none");
      }, 1200);
    } catch (err) {
      setCopySuccess("none");
    }
  };
  let val = "start";

  const ExtractTimefromDateString = (str) => {
    let date = new Date(str);
    return date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    // return str.toLocaleString
  };
  const ExtractDatefromDateString = (str) => {
    let date = new Date(str);
    return date.toLocaleDateString();
    // return str.toLocaleString
  };

  return (
    <div style={{ backgroundColor:"#344955" ,  textAlign: "-webkit-center" ,borderRadius:"3px"}}>
      <div style={{ textAlign: "-webkit-center",maxHeight:"70px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: "10%",
            marginRight: "10%",
            borderBottomColor:"lightblue",
            borderBottomStyle: "solid",
            paddingTop:"18px"
            // background:"#6A0DAD"
            // overflow:"hidden"
          }}
        >
          <button 
          style={{
            backgroundColor:"#135D66" ,borderRadius:"8px", display:"flex",alignItems:"center"}} className="logoutBtn px-2 py-1 flex self-end" onClick={logout}>
            <Link to="/" className="flex self-end" style={{fontSize:"16px", textDecoration: "none", color: "beige", }}>
              Log out
            </Link>
            <span class="ml-2 material-symbols-outlined">
logout
</span>
          </button>

          <button
          style={{fontSize:"16px",
          backgroundColor:"#135D66",borderRadius:"8px", display:"flex",alignItems:"center"}}
            className="logoutBtn px-2 py-1 flex self-end"
            onClick={() => {
              copyToClipBoard(newId);
            }}
          >
            {/* Id :: {newId} */}
            Copy Group Id
            <span class="ml-2 material-symbols-outlined">
content_copy
</span>
          </button>

          <button className="logoutBtn px-2 py-1 flex self-end" 
          style={{
            backgroundColor:"#135D66",borderRadius:"8px", display:"flex",alignItems:"center"}}>
            <Link
              to="/rooms" className="flex self-end"
              style={{fontSize:"16px", textDecoration: "none", color: "beige", display:"flex",alignItems:"center"}}
            >
              All Rooms
              <span class="ml-2 material-symbols-outlined">
apps
</span>
            </Link>
          </button>
        </div>
     
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "1%",
          }}
        >
          <div
            className="alert alert-warning rounded"
            role="alert"
            style={{
              color: "black",
              backgroundColor: "grey",
              borderColor: "#ffecb5",
              width: "150px",
              padding: "0%",
              display: `${CopySuccess}`,
              fontSize:"25px"
            }}
          >
            {" "}
            Copied ✅{" "}
          </div>
        </div>
        <div className="lists">
          {messageList.map((ele, ind) => {
            return (
              // <div>
              <>
              {ind == 0 ? (
                <div className="text-white px-2 py-2"> <span style={{backgroundColor:"grey",fontSize: "0.9rem"}} className="bg-blue-400 px-1 py-1 rounded text-xs">{ExtractDatefromDateString(messageList[0].Date)}</span></div>
              ) : (
                <div className="text-white  px-2 py-2">
                  {ExtractDatefromDateString(messageList[ind - 1].Date) ==
                  ExtractDatefromDateString(messageList[ind].Date) ? (
                    <></>
                  ) : (
                    <div className="text-white px-2 py-2">
                      <span style={{backgroundColor:"grey",fontSize: "0.9rem"}} className="bg-blue-400 px-1 py-1 rounded text-xs">
                      {ExtractDatefromDateString(messageList[ind].Date)}</span>
                    </div>
                  )}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  color: "white",
                  padding: "8px",
                  borderRadius: "8px",
                  margin: "1%",
                  // maxWidth: "728px",
                  justifyContent: `${
                    ele.userId === auth.currentUser.uid ? "end" : "start"
                  }`,
                  flexDirection: `${
                    ele.userId === auth.currentUser.uid ? "row-reverse" : "row"
                  }`,
                }}
              >
                
                {/* <div className="flex-row"> */}
                <button
                  style={{
                    alignSelf: "start",
                    padding: "0%",
                    fontSize: "1rem",
                  }}
                  type="button"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={`${ele.name}`}
                >
                  <img
                    src={
                      ele.url ||
                      "https://th.bing.com/th/id/OIP.zBut8QVH36Vn_Mn84OznCAHaHa?pid=ImgDet&rs=1"
                    }
                  />
                </button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: `${
                      ele.userId === auth.currentUser.uid ? "end" : "start"
                    }`,
                    // alignItems: "end",
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      color: "black",
                      padding: `${!ele.desc ? "0px" : "8px"}`,
                      borderRadius: `${!ele.desc ? "0px" : "8px"}`,
                      marginLeft: "3px",
                      marginRight: "3px",
                      marginTop: "3px",
                      textAlign: "left",
                      maxWidth: "300px",
                      wordBreak: "break-word",
                      fontSize:"14px",
                      // lineHeight:"normal",
                      // pointer:"cursor",
                      backgroundColor: `${
                        ele.userId !== auth.currentUser.uid
                          ? "#F8F6E3"
                          : "#7AA2E3"
                      }`,
                    }}
                  >
                    {!ele.desc ? (
                      <img
                        style={{
                          width: "250px",
                          height: "250px",
                          borderRadius: "12px",
                          margin: "0px",
                          border: "solid",
                          borderColor: "darkcyan",
                        }}
                        src={ele.Imgurl}
                      />
                    ) : (
                      ele.desc
                    )}
                    {/* <div style={{display:`${ele.userId !== auth.currentUser.uid?"none":"visible"}`}}>&nbsp;</div>  */}
                    
                    <img
                      onClick={
                        ele.userId == auth.currentUser.uid
                          ? () => {
                              deleter(ind);
                            }
                          : console.log("s")
                      }
                      style={{
                        alignSelf: "center",
                        zoom: "50%",
                        cursor: "pointer",
                        marginLeft: "11px",
                        // fontSize:"2px",
                        display: `${
                          ele.userId !== auth.currentUser.uid
                            ? "none"
                            : "visible"
                        }`,
                      }}
                      src={bin}
                    />
                  </div>
                  <div
                    className="timer"
                    style={{
                      color: "black",
                      padding: "3px",
                      borderRadius: "8px",
                      margin: "10px",
                      marginBottom: "80px",
                      fontSize:"9px",
                      width: "fit-content",
                      backgroundColor: `${
                        ele.userId !== auth.currentUser.uid
                        ? "#F8F6E3"
                        : "#7AA2E3"
                      }`,
                    }}
                  >
                    {ExtractTimefromDateString(ele.Date)}
                    {/* {ele.Date} */}
                  </div>
                </div>
                </div>
              </>
            );
          })}
        </div>

        {/* <div style={{marginTop:"4%"}}></div> */}
        {/* <div className="footerDiv">
          <div className="footerr" style={{ marginRight:window.innerWidth<=730 ? "1%" : window.innerWidth<=1000 ?"2%" : "14%" }} > <img src={downer} onClick={handleImageClick} /> </div>
      </div> */}

{/* <div class="input-wrapper"> 
        <input type="text" placeholder="Search..."/> 
        <button onclick="alert('Button clicked!');"> 
            🔍 
        </button> 
    </div>  */}
        <div className="footerDiv">
          <form className="footer" onSubmit={createmessage} style={{backgroundColor:"inherit"}}>
            <input
            
              className="inputer"
              placeholder="Your Message ..."
              onChange={handleinput}
              value={inputer}
              style={{ flex: "1", marginRight: "10px", padding: "10px", borderRadius: "8px", border: "0.1px solid #ccc" }} // Added flex, padding, and border radius
   
            />
            {/* <div> */}

            {/* </div> */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "end",
              }}
            >
              <img
                className="Scroller"
                style={{
                  border: "solid",
                  borderRadius: "30%",
                  padding: "8%",
                  marginLeft: "10%",
                  alignSelf: "center",
                  backgroundColor: "#344955",
                }}
                src={downer}
                onClick={handleImageClick}
              />
              <button
                style={{
                  backgroundColor: "#344955",
                  color: "white",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "5%",
                  
                  // paddingTop: "20%",
                }}
              >
                🕊️
              </button>
            </div>
            {/* </div> */}
          </form>

          {/* <input
        className="footer"
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            /> */}

          {/* <button onClick={uploadFile}> Upload Image</button>  */}

          {/* </div>    */}
          {/* <form onSubmit={handleFireBaseUpload}>
        <input 
          type="file"
          onChange={handleImageAsFile}
        />
        <button>upload to firebase</button>
        </form> */}
        </div>
        
        <div className="dummy" id="dummy"></div>
      </div>
    </div>
  );
}
