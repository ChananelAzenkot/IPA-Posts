import { GeneralContext } from "../App";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import "./Articles.css";
import { Link, useNavigate } from "react-router-dom";

export default function RecycleBin() {
  const [trash, setTrash] = useState([]);
  const { snackbar, setIsLoader } = useContext(GeneralContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoader(true);
    fetch(`https://api.shipap.co.il/articles/recycle-bin`, {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setTrash(data);
        setIsLoader(false);
      });
  }, []);

  const Restore = (id) => () => {
    setIsLoader(true);
    fetch(`https://api.shipap.co.il/articles/restore/${id}`, {
      credentials: "include",
      method: "PUT",
    }).then(() => {
      setTrash(trash.filter((r) => r.id !== id));
      setIsLoader(false);
      snackbar("המוצר שוחזר בהצלחה");
    });
  };

  return (
    <>
      <button className="returnLink" onClick={() => navigate("/")}>
        חזרה לכתבות
      </button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>כותרת</th>
            <th>תאריך יצירה</th>
            <th>תאריך פרסום</th>
            <th>צפיות</th>
            <th>לשחזור</th>
          </tr>
        </thead>
        <tbody>
          {trash.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{a.headline}</td>
              <td>{moment(a.addedTime).format("DD/MM/YY")}</td>
              <td>{moment(a.publishDate).format("DD/MM")}</td>
              <td>{a.views}</td>
              <td>
                <button className="red" onClick={Restore(a.id)}>
                  <AiFillDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
