import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import { createElement } from "react";
import { renderToReadableStream } from 'react-dom/server.browser';
import App from "./frontend/App";

// bundle client side react-code each time the server starts
await Bun.build({
  entrypoints: ['./src/frontend/index.tsx'],
  outdir: './public',
});

const app = new Elysia().use(staticPlugin())

app.get("/api", () => "Hello Elysia");
app.get('/', async () => {

  // create our react App component
  const app = createElement(App)

  // render the app component to a readable stream
  const stream = await renderToReadableStream(app, {
    bootstrapScripts: ['/public/index.js']
  })

  // output the stream as the response
  return new Response(stream, {
    headers: { 'Content-Type': 'text/html' }
  })
})

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
