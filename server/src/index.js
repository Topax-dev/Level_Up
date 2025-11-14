import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './route/route.js'

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

app.use(cookieParser())
app.use(cors({
  origin: '*',  
  credentials: true,                
}))
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      httpOnly: true, 
      secure: process.env.isProduction, 
      sameSite: "strict"
    }, 
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))
app.use(routes)


app.listen(port, () => console.log(`Mantap Bang 🤴 Server jalan di http://localhost:${port}`))
