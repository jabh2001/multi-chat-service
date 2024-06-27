import 'dotenv/config';
import express from "express"
import cors from "cors"
import apiRouter from "./routers/api"
import cookieParser from "cookie-parser"
import SocketPool from './libs/message-socket/socketConnectionPool';
import { app } from './app';
import listenRouter from './routers/listenRouter';
import messageWsRouter from './routers/api/messageRouter';
import { isAuthenticatedMiddleware } from './service/authService';
import imageRouter from './routers/imageRouter';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync("./socket_provider_session_files")) {
  try {
    mkdirSync("./socket_provider_session_files", { recursive: true });
    console.log(`La carpeta ${"./socket_provider_session_files"} ha sido creada.`);
  } catch (error) {
    console.error("Error creating directory:", error);
  }
} else {
  console.log(`La carpeta ${"./socket_provider_session_files"} ya existe.`);
}

try{

    SocketPool.getInstance();
}catch(e){
    console.error('Error en SocketPool', e)
}

try {
  app.use(express.json({ limit: "10mb" }));
} catch (error) {
  console.error("Error using express.json:", error);
}

try {
  app.use(cookieParser());
} catch (error) {
  console.error("Error using cookieParser:", error);
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use((req, res, next) => {
  if (/^\/(api|listen|ws|img|static)/i.test(req.url)) {
    next();
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.join(process.cwd() + "/frontDist/index.html"));
  }
});

app.use("/api", apiRouter);
app.use('/listen', isAuthenticatedMiddleware, listenRouter);
app.use('/ws', messageWsRouter);
app.use('/img', imageRouter);

app.get("/static/:filename", (req, res) => {
  res.header('Cache-Control', 'public, max-age=604800');
  res.sendFile(path.join(process.cwd() + "/frontDist/static/" + req.params.filename));
});

const port = 3000;

  const server = app.listen(port, () => console.log(`This express server is now running on port: ${port}`));
  export { server, app };

