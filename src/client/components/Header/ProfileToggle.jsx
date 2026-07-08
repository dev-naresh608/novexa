import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { UserContext } from "../../contexts/context";
import { defaultPP } from "../../../../public/assets";
import { MiniProfileContainer } from "..";
import { Home, LogOut, Mail, User } from "lucide-react";

function ProfileToggle() {
  const {
    setIsLogin,
    currentUser,
    isProfileClicked,
    setActiveTab,
    setIsProfileClicked,
    isNotificationClicked,
    setIsNotificationClicked,
    setCurrentUserRole,
  } = useContext(UserContext);

  const navigate = useNavigate();

  // Base shared styles for navigation links
  const commonStyle =
    "flex items-center px-2 py-1 gap-1 font-semibold my-1 hover:bg-gray-100 rounded transition-colors duration-150";

 
  const menuItems = [
    {
      label: "Home",
      to: "dashboard",
      icon: <Home size={17} strokeWidth={2.5} />,
      onClick: () => setIsProfileClicked(false),
    },
    {
      label: "Profile",
      to: "profile",
      icon: <User size={17} strokeWidth={2.5} />,
      onClick: () => {setIsProfileClicked(false),setActiveTab('personalinformation')},
    },
  ];

  const handleLogout = () => {
    setIsProfileClicked(false);
    setCurrentUserRole("customer");
    navigate("/");
    // setIsLogin(false); // ! error.
    window.location.reload()
  };

  return (
    <>
      <div className="relative z-[100]">
        <button
          onClick={() => {
            setIsProfileClicked((prev) => !prev);
            if (isNotificationClicked) {
              setIsNotificationClicked(false);
            }
          }}
          className="block"
        >
          <div className="flex items-center justify-center overflow-hidden rounded-full h-7 w-7 border border-green-800">
            <img
              loading="lazy"
              className="active:h-6 active:w-6 object-cover h-full w-full"
              src={currentUser?.imageUrl || defaultPP}
              alt="profile picture"
            />
          </div>
        </button>

        {/* Dropdown Menu Container */}
        <div
          className={`absolute right-0 min-w-[200px] md:w-[20vw] lg:w-[20vw] shadow-md bg-white rounded-xl z-50 ${
            isProfileClicked ? "block" : "hidden"
          }`}
        >
          <div className="absolute right-2 top-2">
            <button
              onClick={() => {
                setIsNotificationClicked(false);
                setIsProfileClicked(false);
              }}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              ✘
            </button>
          </div>

          <ul>
            {/* User Info Section */}
            <li className="p-2 border-b border-gray-100">
              <MiniProfileContainer />
            </li>

            {/* Navigation Links Loop */}
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  onClick={item.onClick}
                  className={commonStyle}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Logout Button*/}
            <li>
              <Link
                onClick={handleLogout}
                className={`${commonStyle} text-red-600 hover:bg-red-50`}
              >
                <LogOut size={17} strokeWidth={2.5} />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* profile sidebar */}
      {/* <div className="font-semibold">
          <p className="text-sm">{currentUser.username}</p>
          <p className="text-[10px] space-x-2">
            <span className="bg-green-200 rounded-2xl px-1.5 text-gray-800 ">
              active
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-1.5 rounded-full">{currentUser.role}</span>
          </p> 
        </div> */}
    </>
  );
}

export default ProfileToggle;
