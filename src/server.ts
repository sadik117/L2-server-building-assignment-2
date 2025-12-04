import express, { Request, Response } from 'express'
const app = express()
const port = 5000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Universe..!')
})

app.post('/', (req: Request, res: Response) => {
  res.status(201).json({
  success: true,
  message: 'Api is working fine'
})      
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
