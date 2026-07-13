import {
  Home,
  Bookmark,
  Heart,
  MessageCircle,
  Settings,
  User,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


const Sidebar = () => {

  const { user, logout } = useAuth();


  const links = [
    {
      name: "Feed",
      path: "/feed",
      icon: Home,
    },
    {
      name: "Bookmarks",
      path: "/bookmarks",
      icon: Bookmark,
    },
    {
      name: "Likes",
      path: "/likes",
      icon: Heart,
    },
    {
      name: "Chat",
      path: "/chat",
      icon: MessageCircle,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];


  return (
    <aside
      className="
      flex
      h-screen
      w-72
      flex-col
      border-r
      border-border
      bg-surface
      px-5
      py-6
      "
    >

      {/* Logo */}
      <div
        className="
        mb-10
        flex
        items-center
        gap-3
        "
      >

        <div
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-primary
          text-background
          font-bold
          "
        >
          D
        </div>


        <h1
          className="
          text-2xl
          font-bold
          tracking-tight
          text-text
          "
        >
          DevBoard
        </h1>

      </div>



      {/* Main navigation */}
      <nav className="space-y-2">

        {
          links.map((link)=>{

            const Icon = link.icon;


            return (
              <NavLink
                key={link.name}
                to={link.path}

                className={({isActive})=>
                  `
                  group
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all

                  ${
                    isActive
                    ?
                    "bg-primary text-background shadow-lg"
                    :
                    "text-text-secondary hover:bg-surface-hover hover:text-text"
                  }
                  `
                }
              >

                <Icon 
                  size={21}
                  className="transition-transform group-hover:scale-110"
                />

                {link.name}

              </NavLink>
            )

          })
        }

      </nav>



      {/* Bottom section */}
      <div
        className="
        mt-auto
        space-y-3
        "
      >


        {/* Profile */}
        <NavLink
          to="/profile"
          className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-border
          bg-background
          p-3
          transition
          hover:bg-surface-hover
          "
        >

          {
            user?.profile_url
            ?
            (
              <img
                src={user.profile_url}
                className="
                h-10
                w-10
                rounded-full
                object-cover
                "
              />
            )
            :
            (
              <div
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-primary
                text-background
                "
              >
                <User size={20}/>
              </div>
            )
          }


          <div className="overflow-hidden">

            <p
              className="
              truncate
              text-sm
              font-semibold
              text-text
              "
            >
              {user?.name}
            </p>


            <p
              className="
              truncate
              text-xs
              text-text-secondary
              "
            >
              @{user?.username}
            </p>

          </div>


        </NavLink>



        {/* Logout */}
        <button
          onClick={logout}

          className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          text-sm
          font-medium
          text-danger
          transition

          hover:bg-red-500/10
          "
        >

          <LogOut size={20}/>

          Logout

        </button>


      </div>


    </aside>
  );
};


export default Sidebar;