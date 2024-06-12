import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ContactDetailPage, ContactsPage, IndexPage, QrPage } from "./routes"
import Layout from "./components/layout"
import configRouter from "./routes/Config"
import LoginPage from "./routes/LoginPage"
import ChatPage from "./routes/ChatPage"

const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout />,
    children:[
      {
        path:"/",
        element: <IndexPage />
      },
      {
        path:"/conversations",
        element: <ChatPage />
      },
      {
        path:"/contacts",
        element: <ContactsPage />
      },
      {
        path:"/contacts/:contactId",
        element: <ContactDetailPage />
      },
      {
        path:"/qrs",
        element: <QrPage/>
      },
      ...configRouter
    ]
  },{
    path:"/login",
    element:<LoginPage />
  }
])

// eslint-disable-next-line react-refresh/only-export-components
export default () => <RouterProvider router={router} />
