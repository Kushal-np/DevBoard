import { useTheme } from "../theme/useTheme";

function LandingPage(){
  const {theme , toggleTheme} = useTheme();


  return(
    <div>
      <button
      onClick={toggleTheme}
      >
        button
      </button>
      {theme === "light"? "Dark":"light"}
      <div className="bg-background text-text-secondary">Hello</div>
    </div>
  )
}

export default LandingPage;