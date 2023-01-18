import React, { useEffect, useState } from "react";
import "./App.css";
import Post from "./post";
import { Button, Input, Modal, makeStyles } from "@material-ui/core";
import ImageUpload from './ImageUpload';

const BASE_URL = "http://localhost:8000/";
function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    trasform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    width: 400,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modelStyle, setModelStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState(window.localStorage.getItem("authToken") || null);
  const [authTokenType, setAuthTokenType] = useState(window.localStorage.getItem("authTokenType") || null);
  const [userId, setUserId] = useState(window.localStorage.getItem("userId") || "");
  const [email, setEmail] = useState('')
  // useEffect(() => {
  //   setAuthToken(window.localStorage.getItem('authToken'));
  //   setAuthTokenType(window.localStorage.getItem('authTokenType'));
  //   setUsername(window.localStorage.getItem('username'));
  //   setUserId(window.localStorage.getItem('userId'))
  // }, [])

  useEffect(() => {
    setAuthToken(window.localStorage.getItem("authToken"));
    setAuthTokenType(window.localStorage.getItem("authTokenType"));
    setUsername(window.localStorage.getItem("username"));
    setUserId(window.localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    authToken
      ? window.localStorage.setItem("authToken", authToken)
      : window.localStorage.removeItem("authToken");
    authTokenType
      ? window.localStorage.setItem("authTokenType", authTokenType)
      : window.localStorage.removeItem("authTokenType");
    username
      ? window.localStorage.setItem("username", username)
      : window.localStorage.removeItem("username");
    userId
      ? window.localStorage.setItem("userId", userId)
      : window.localStorage.removeItem("userId");
  }, [authToken, authTokenType, userId, username]);

  useEffect(() => {
    fetch(BASE_URL + "post/all")
      .then((response) => {
        const json = response.json();
        console.log(json);
        if (response.ok) {
          return json;
        }
        throw response;
      })
      .then((data) => {
        const results = data.sort((a, b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);
          const d_a = new Date(
            Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[3], t_a[4], t_a[5])
          );
          const d_b = new Date(
            Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[3], t_b[4], t_b[5])
          );
          return d_b - d_a;
        });
        return results;
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  }, []);

  const signIn = (event) => {
    event?.preventDefault();

    let formData = new FormData();

    formData.append("username", username);

    formData.append("password", password);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch(BASE_URL + "login", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw response;
      })
      .then((data) => {
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
        setUsername(data.username);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });

    setOpenSignIn(false);
  };

  const signOut = (event) => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId("");
    setUsername("");
  };

  const signUp = (event) => {
    event?.preventDefault();
    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    })
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: json_string
    }
      fetch(BASE_URL + 'user/', requestOptions)
      .then(response =>{
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then (data => {
        // console.log(data);
        signIn();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })
      setOpenSignUp(false)
    }

  return (
    <div className="app">
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modelStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                className="app_headerImage"
                src="https://thumbs.dreamstime.com/b/instagram-141049465.jpg"
                alt="Instagram"
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Login
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={modelStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                className="app_headerImage"
                src="https://thumbs.dreamstime.com/b/instagram-141049465.jpg"
                alt="Instagram"
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              Signup
            </Button>
          </form>
        </div>
      </Modal>



      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://thumbs.dreamstime.com/b/instagram-141049465.jpg"
          alt="Instagram"
        />

        {authToken ? (
          <Button onClick={() => signOut()}> Logout </Button>
        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            &nbsp;&nbsp;
            <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
          </div>
        )}
      </div>
      <div className="app_posts">

        {posts.map((post) => (

         <Post key={post.id} post={post}
         authToken ={authToken}
         authTokenType={authTokenType}
         username ={username}
         />

        ))}
      </div>
{
  authToken ? (
<ImageUpload

    authToken={authToken}
    authTokenType = {authTokenType}
    userId={userId}
/>

  ) : (
    <h3>You need to be authenticated to upload </h3>
  )

}

    </div>
  );
}
export default App;
