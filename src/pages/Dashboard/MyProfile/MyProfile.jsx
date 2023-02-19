import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase/firebaseInit";
import UpdateForm from "./UpdateForm";
import { useQuery } from "react-query";
import Loader from "../../../helper/Loader";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { BsLinkedin } from "react-icons/bs";
import defaulImage from "../../../assets/images/profile.png";

const MyProfile = () => {
  const [showForm, setShowForm] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // console.log(user.email);

  const { isLoading, data, refetch } = useQuery("repoData", () =>
    fetch(`https://alliance.onrender.com/users/one?email=${user.email}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        signOut(auth);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
      return res.json();
    })
  );

  // console.log(data);

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="lg:ml-28 ml-0 flex gap-12 justify-between flex-col lg:flex-row md:flex-row h-full">
      <div className="flex gap-5 w-full lg:w-1/2 md:w-full flex-col">
        <div className="flex items-center flex-col justify-center ">
          <img
            className="mask mask-hexagon w-[200px]"
            src={defaulImage}
            alt="Profile"
          />
        </div>
        <div>
          <div className="mb-6">
            <p className="font-bold">Full Name</p>
            <p> {user.displayName} </p>
          </div>
          <div className="mb-6">
            <p className="font-bold">Email Address</p>
            <p> {user.email} </p>
          </div>
          <div className="mb-6">
            <p className="font-bold">Address</p>
            <p> {data.address} </p>
          </div>
          <div className="mb-6">
            <p className="font-bold">Phone</p>
            <p>{data.number}</p>
          </div>
          <div className="mb-6">
            <p className="font-bold">Education</p>
            <p>{data.education}</p>
          </div>
          <div className="mb-6">
            <p className="font-bold">LinkdIn Profile</p>
            <a
              className="font-bold text-blue-600 underline"
              href={data.linkedin}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <BsLinkedin />
                </span>
                <span>likedin</span>
              </div>
            </a>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary w-full max-w-xs"
        >
          Edit Profile
        </button>
      </div>
      <div className="lg:w-1/2 w-full md:w-full">
        {showForm && <UpdateForm refetch={refetch} setShowForm={setShowForm} />}
      </div>
    </div>
  );
};

export default MyProfile;
