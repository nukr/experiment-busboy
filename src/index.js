import serve from 'koa-static'
import mount from 'koa-mount'
import Koa from 'koa'
import Busboy from 'busboy'
import fs from 'fs'

const app = new Koa()

app.use(mount('/form', serve('src')))
app.use(mount('/upload', upload))

app.listen(3000, () => {
  console.log('server listening on port 3000')
})

async function upload (context, next) {
  let busboy = new Busboy({headers: context.req.headers})
  context.req.pipe(busboy)
  let filename = await new Promise((resolve, reject) => {
    busboy.on('file', (fieldname, file, filename) => {
      let writestream = fs.createWriteStream(filename)
      file.pipe(writestream)
      writestream.on('close', () => resolve(filename))
    })
  })
  context.body = filename
}
