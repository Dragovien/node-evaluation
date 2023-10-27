import { createServer } from 'node:http'
import { createReadStream, readFileSync } from "node:fs";
import queryString from 'node:querystring';
import { students } from './Data/students.js'
import { formattedArray, verifyInput, deleteStudent } from './utils.js';
import dotenv from 'dotenv';
dotenv.config()
const { APP_ENV, APP_PORT, APP_LOCALHOST } = process.env

const server = createServer(async (req, res) => {

  const { method } = req

  if (method === 'GET') {

    if (req.url === '/favicon.ico') {
      res.writeHead(200, {
        "Content-type": 'image/ico'
      })
      res.end()
      return
    }

    if (req.url === '/style') {
      const css = readFileSync('./assets/css/style.css', 'utf8')
      res.writeHead(200, { 'Content-type': 'text/css' })
      res.end(css)
      return
    }

    if (req.url === '/') {
      res.writeHead(200, {
        "Content-type": 'text/html'
      })
      createReadStream('./view/home.html').pipe(res)

    } else if (req.url === '/users') {
      res.writeHead(200, { 'content-type': 'text/html' })

      let html = '<ul class="userList" >'

      formattedArray(students).map((student, index) => {
        html += `<li class="userItem" >
        <form action="/deleteStudent/${index}" method="POST" class="userForm">
            <p>${student.name} ${student.birth}</p>
            <button type="submit">X</button>
        </form>
          </li>`
      })
      html += '</ul>'

      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Les étudiant</title>
            <link href="/style" rel="stylesheet" type="text/css" />
        </head>
        <body>
        <header>
          <nav class="nav">
            <ul class="navList">
              <li class="navItem"><a type="submit" class="" href="/">Home</a></li>
              <li class="navItem"><a type="submit" class="" href="/users">Users</a></li>
            </ul>
          </nav>
        </header>
          <main>
            <div class='container'>
              <h1>Liste des étudiants</h1>
                ${html}
            </div> 
          </main>
        </body>
        `)
    } else {
      res.writeHead(200, {
        "Content-type": 'text/html'
      })
      createReadStream('./view/404.html').pipe(res)
    }
  } else if (method === 'POST') {

    let url = `${APP_LOCALHOST}:${APP_PORT}`
    const parsedUrl = new URL(req.url, url)
    let {pathname} = parsedUrl
    pathname = pathname.substring(1)
    const pathPart = pathname.split('/')

    let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

    if (pathPart.length > 0 && pathPart[0] === '') {

      req.on('end', () => {

        const formData = queryString.parse(body);
        let name = formData.name;
        let birth = formData.birth

        verifyInput(res, name, birth, students)
      });
    } else if (pathPart.length > 0 && pathPart[0] === 'deleteStudent') {
      
      req.on('end', () => {
        deleteStudent(res, students, pathPart[1])
      });
    }
  }
})

server.listen(APP_PORT)