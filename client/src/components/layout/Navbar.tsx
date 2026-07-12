import { useTheme } from "../../theme/useTheme";

const Navbar = ()=>{
    const {theme , toggleTheme} = useTheme();
    return(
        <div>
            <button onClick={toggleTheme}>
            {theme === "light"? "Dark":"light"}
            </button>
        </div>
    )
}

export default Navbar;