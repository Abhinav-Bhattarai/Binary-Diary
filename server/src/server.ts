import express, {Request, Response} from 'express';

const app:express.Application = express();

app.use('/', (req: Request, res:Response) => {
    return res.json({hi: "<h1>hello</h1>"})
})

app.listen(8000, () => {
    console.log('hello')
})