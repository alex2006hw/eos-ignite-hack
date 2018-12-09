import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import demux from './services/demux'
import posts from './routes/posts'
import io from './utils/io'
// import Token from './utils/token'

// const noise = require('noise-network')

const app = express()
const backend = app.listen(process.env.PORT, () => console.info(`Example app listening on port ${process.env.PORT}!`))
// Set up a whitelist and check against it:
var whitelist = ['http://dev01.alex2006hw.com', 'http://dev01.alex2006hw.com:8080',, 'http://dev01.alex2006hw.com:8887', 'http://localhost']
var corsOptions = {
  origin: function (origin, callback) {
    // if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  }
}

// Then pass them to cors:
app.use(cors(corsOptions))
// app.use(Gun.serve)

app.use('/posts', posts())

io.connect(backend)

demux.watch()
///--------------------------------------------------------
/// noise Server starts
///--------------------------------------------------------
// var noiseServer = noise.createServer()
// noiseServer.on('connection', function (encryptedStream) {
  // console.log('1.backend noiseServer encrypted stream!')
//
  // // encryptedStream is a noise-peer stream instance
  // encryptedStream.on('data', function (data) {
    // console.log('2.backend noiseServer client wrote:', data)
  // })
// })
//
//
// Token(backend, ({root}) => {
  // root.path('SERVER').map().on(server => {
    // console.log('3.backend server : ', server)
    // server.path('TOKENS').map().on( token => {
      // console.log('4.backend tokens : ', token)
    // })
  // })
// })
