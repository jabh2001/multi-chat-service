import { type RouteObject } from "react-router-dom";
import FastMessagePage from "./FastMessagePage";

const baseName = "/config/fastMessage"
const fastMessageRouter: RouteObject[] = [
  {

    path: baseName,
    element: <FastMessagePage />
  },

];


export default fastMessageRouter
