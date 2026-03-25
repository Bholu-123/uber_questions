export const initialTree = {
  id: 1,
  name: "root",
  type: "folder",
  expanded: true,
  children: [
    {
      id: 2,
      name: "src",
      type: "folder",
      expanded: true,
      children: [
        {
          id: 3,
          name: "App.jsx",
          type: "file",
          content:
            "// Your React app\nimport React from 'react';\n\nexport default function App() {\n  return <div>Hello World</div>;\n}",
        },
        {
          id: 4,
          name: "index.css",
          type: "file",
          content: "body {\n  margin: 0;\n  font-family: sans-serif;\n}",
        },
      ],
    },
    {
      id: 5,
      name: "public",
      type: "folder",
      expanded: false,
      children: [
        {
          id: 6,
          name: "index.html",
          type: "file",
          content:
            "<!DOCTYPE html>\n<html>\n  <head><title>App</title></head>\n  <body><div id='root'></div></body>\n</html>",
        },
      ],
    },
    {
      id: 7,
      name: "package.json",
      type: "file",
      content: '{\n  "name": "my-app",\n  "version": "1.0.0"\n}',
    },
    {
      id: 8,
      name: "README.md",
      type: "file",
      content: "# My Project\n\nA React application.",
    },
  ],
};
