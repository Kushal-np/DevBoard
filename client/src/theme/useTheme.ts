import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

export const useTheme = () =>{
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error("useTheme must be used inside the themeprovider");
    }
    return context;
}