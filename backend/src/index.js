import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import demux from './services/demux'
import posts from './routes/posts'
import io from './utils/io'

let app = express()

// Set up a whitelist and check against it:
var whitelist = ['http://dev01.alex2006hw.com', 'http://dev01.alex2006hw.com:8080',, 'http://dev01.alex2006hw.com:8887', 'http://localhost']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Then pass them to cors:
app.use(cors(corsOptions));
// app.use(cors())

app.use('/posts', posts())

const server = app.listen(process.env.PORT, () => console.info(`Example app listening on port ${process.env.PORT}!`))

io.connect(server)

demux.watch()
