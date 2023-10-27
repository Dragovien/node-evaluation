
import {createServer} from 'node:http'
import { createReadStream, appendFileSync} from "node:fs";
import queryString from 'node:querystring';
import {students} from './Data/students.js'
import { formattedArray } from './utils.js';
import dotenv from 'dotenv';
dotenv.config()
const {APP_ENV, APP_PORT, APP_LOCALHOST} = process.env

const server = createServer(async (req, res) => {

  let url = `${APP_LOCALHOST}:${APP_PORT}`

    const {method} = req

    if(method === 'GET') {

      if (req.url === '/favicon.ico') {
          res.writeHead(200, {
              "Content-type": 'image/ico'
          })
          res.end()
          return
      }

      if (req.url === '/style') {
        const css = readFileSync('./assets/css/style.css', 'utf8')
        res.writeHead(200, {'Content-type': 'text/css'})
        res.end(css)
        return
      }

      if (req.url === '/') {
        res.writeHead(200, {
            "Content-type": 'text/html'
        })
        createReadStream('./view/home.html').pipe(res)

      } else if(req.url === '/users') {
        res.writeHead(200, {'content-type': 'text/html'})

        let html = '<ul>'

        students.map(student => {
          html += `<li>
            <p>${student.name} ${student.birth}</p>
            <button>X</button>
          </li>`
        })
        html += '</ul>'

        res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Les étudiant</title>
        </head>
        <body>
          <h1>Étudiants</h1>
          ${html}
          <a href='/'>Home</a>
        </body>
        `)
      } else {
        res.writeHead(200, {
          "Content-type": 'text/html'
      })
      createReadStream('./view/404.html').pipe(res)
      }
    } else if(method === 'POST') {
      if (req.url === '/') {
        let body = '';
  
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
  
        req.on('end', () => {

          const formData = queryString.parse(body);
          const name = formData.name;
          const birth = formData.birth

          if(
            name?.trim() === '' 
            || birth?.trim() === '' 
            || name?.trim() === '' && birth?.trim()
          ) {
            let message = ''
            if(name?.trim() === '' && birth?.trim() === '') {
              message = 'les 2 champs'
            } else {
              message = name?.trim() === '' ? 'un nom' : 'une date de naissance'
            }

            console.log(`Veuillez rentrer ${message}`)
            res.writeHead(302, { 'Location': '/' });
            res.end()
            return
          }

          if(!isNaN(parseInt(name.trim()))) {
            console.log(`Veuillez rentrer une chaine de caractères`)
            res.writeHead(302, { 'Location': '/' });
            res.end()
            return
          }

          students.push({name, birth})
          res.writeHead(302, { 'Location': '/' });
          res.end();
        });
      }
    }
})

server.listen('8888')