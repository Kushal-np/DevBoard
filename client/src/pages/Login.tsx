import { useAuth } from "../context/AuthContext";

function Login(){
    const {user , login , logout} = useAuth();

    const [username , setUsername] = useState("");
    const [email , setEmail] = useState("");
    function handleSubmit(e) =>{
        try{
            setUsername(e.username)
        }
        catch(error){
            
        }
    }
    return(
        <div>
            <h1>Login</h1>
            {user? (
                <div>
                    <div> username : {user.username}</div>
                    <div> email : {user.email}</div>
                    <button onClick={logout}>
                        logout
                    </button>
                </div>

                       
            ):
            (<div>
                <form action="">

                <input placeholder="username" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                <input type="email" value={email}  onChange={(e)=> setEmail(e.target.value)}/>
                <button type="submit">
                    login
                </button>
                </form>

            </div>)

            }
        </div>
    )
}

export default Login;