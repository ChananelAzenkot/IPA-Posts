import { useContext, useState } from "react";
import { GeneralContext } from "../App";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    fullName: "",
  });
  const [signupError, setSignUpError] = useState("");
  const { setIsLoader, snackbar } = useContext(GeneralContext);

  const handelInput = (ev) => {
    const { name, value } = ev.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const setSignUpServer = (ev) => {
    ev.preventDefault();
    setIsLoader(true);

    fetch("https://api.shipap.co.il/signup", {
      credentials: "include",
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then((x) => {
            throw new Error(x);
          });
        }
      })
      .then((data) => {
        snackbar("המשתמש נוצר בהצלחה");
      })
      .catch((err) => {
        setSignUpError(err.message);
        snackbar(err.message);
        setIsLoader(false);
      })
      .finally(() => setTimeout(() => (window.location.href = "/"), 1000));
  };

  return (
    <div className="Login smallFrame">
      <h2>הרשמה</h2>

      <form onSubmit={setSignUpServer}>
        <label>
          שם משתמש:
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handelInput}
          />
        </label>

        <label>
          סיסמה:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handelInput}
          />
        </label>

        <label>
          אימייל:
          <input
            type="mail"
            name="email"
            value={formData.email}
            onChange={handelInput}
          />
        </label>

        <label>
          שם מלא:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handelInput}
          />
        </label>

        <button>הרשם</button>
        <Link to="/" style={{ textDecoration: "none" }}><button>כבר רשום? התחבר</button></Link>

        {signupError && <div className="fieldError">{signupError}</div>}
      </form>
    </div>
  );
}
