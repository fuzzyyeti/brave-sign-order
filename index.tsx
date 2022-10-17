import React from "react"
import {createRoot} from "react-dom/client";
import {Wallet} from "./Components/Wallet";


const root = createRoot(document.getElementById("app")!)
root.render(<Wallet/>)