import {
  Mail,
  AtSign,
  Users,
  UserPlus,
  MapPin,
  Edit3,
  Code2,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">

      {/* Cover */}
      <div className="relative h-80 w-full overflow-hidden">
        {user.cover_url ? (
          <img
            src={user.cover_url}
            className="h-full w-full object-cover"
            alt="cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-primary/20 to-accent/20" />
        )}

        <div className="absolute inset-0 bg-overlay/30" />
      </div>


      {/* Profile Container */}
      <main className="mx-auto max-w-6xl px-6">

        {/* Main Card */}
        <section
          className="
          relative 
          -mt-24
          rounded-3xl
          border
          border-border
          bg-surface
          p-8
          shadow-xl
          "
        >

          {/* Top */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">


            <div className="flex flex-col gap-6 md:flex-row md:items-end">


              {/* Avatar */}
              <div>
                {user.profile_url ? (
                  <img
                    src={user.profile_url}
                    alt={user.username}
                    className="
                    h-40
                    w-40
                    rounded-3xl
                    border-4
                    border-background
                    object-cover
                    shadow-xl
                    "
                  />
                ) : (
                  <div
                    className="
                    flex
                    h-40
                    w-40
                    items-center
                    justify-center
                    rounded-3xl
                    bg-primary
                    text-5xl
                    font-bold
                    text-background
                    "
                  >
                    {user.name[0]}
                  </div>
                )}
              </div>


              {/* Details */}
              <div>

                <h1 className="text-4xl font-bold">
                  {user.name}
                </h1>


                <p className="mt-2 flex items-center gap-2 text-text-secondary">
                  <AtSign size={16}/>
                  {user.username}
                </p>


                <p className="mt-1 flex items-center gap-2 text-text-secondary">
                  <Mail size={16}/>
                  {user.email}
                </p>


                <p className="mt-5 max-w-xl text-text-secondary">
                  {user.bio ||
                    "Developer building cool things and contributing to the community."}
                </p>

              </div>


            </div>



            <button
              className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-primary
              px-5
              py-3
              font-medium
              text-background
              transition
              hover:bg-primary-hover
              "
            >
              <Edit3 size={18}/>
              Edit Profile
            </button>


          </div>



          {/* Stats */}
          <div
            className="
            mt-10
            grid
            grid-cols-2
            gap-4
            md:grid-cols-4
            "
          >

            <Stat
              title="Followers"
              value={user.followerCount}
            />

            <Stat
              title="Following"
              value={user.followingCount}
            />

            <Stat
              title="Projects"
              value="12"
            />

            <Stat
              title="Reputation"
              value="850"
            />

          </div>

        </section>



        {/* Content */}
        <section
          className="
          mt-10
          grid
          gap-8
          lg:grid-cols-3
          "
        >


          {/* About */}
          <div
            className="
            rounded-2xl
            border
            border-border
            bg-surface
            p-6
            "
          >

            <h2 className="mb-6 text-xl font-bold">
              About
            </h2>


            <div className="space-y-4 text-text-secondary">

              <p className="flex gap-3">
                <MapPin size={18}/>
                Nepal
              </p>


              <p className="flex gap-3">
                <Users size={18}/>
                {user.followers.length} Followers
              </p>


              <p className="flex gap-3">
                <UserPlus size={18}/>
                {user.following.length} Following
              </p>

            </div>

          </div>




          {/* Projects */}
          <div
            className="
            lg:col-span-2
            rounded-2xl
            border
            border-border
            bg-surface
            p-6
            "
          >

            <div className="mb-6 flex items-center gap-3">

              <Code2/>

              <h2 className="text-xl font-bold">
                Featured Projects
              </h2>

            </div>



            <div className="grid gap-5 md:grid-cols-2">


              <ProjectCard
                title="DevBoard"
                description="Developer community platform"
                tech="React • Node • MongoDB"
              />


              <ProjectCard
                title="Portfolio"
                description="Personal developer portfolio"
                tech="React • Tailwind"
              />


            </div>


          </div>


        </section>

      </main>

    </div>
  );
};



function Stat({
  title,
  value
}:{
  title:string;
  value:number|string;
}){

  return (
    <div
      className="
      rounded-2xl
      border
      border-border
      bg-background
      p-5
      text-center
      transition
      hover:-translate-y-1
      "
    >

      <h3 className="text-3xl font-bold">
        {value}
      </h3>

      <p className="mt-1 text-sm text-text-secondary">
        {title}
      </p>

    </div>
  )
}



function ProjectCard({
  title,
  description,
  tech
}:{
  title:string;
  description:string;
  tech:string;
}){

  return(
    <div
      className="
      rounded-2xl
      border
      border-border
      bg-background
      p-5
      transition
      hover:-translate-y-1
      hover:shadow-xl
      "
    >

      <h3 className="text-lg font-bold">
        {title}
      </h3>


      <p className="mt-2 text-text-secondary">
        {description}
      </p>


      <p className="mt-4 text-sm text-accent">
        {tech}
      </p>


    </div>
  )
}


export default Profile;