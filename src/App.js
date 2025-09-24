import {Switch,Route} from "react-router-dom"

import Home from "./components/home";

function App(){



  return (
    <div>
      <Switch>
        <Route path="/" component={Home}/>
      </Switch>
    </div>
  )
}

export default App;