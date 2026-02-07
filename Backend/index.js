import express from 'express'
import dotenv from 'dotenv'
import Db from './Database/Db.js'
import cors from 'cors'
import category from './Routes/category.route.js'
import product from './Routes/product.route.js'
import search from './Routes/search.route.js'


dotenv.config()

const app = express()
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}))


app.use('/api/v1/category',category)
app.use('/api/v1/product',product)
app.use('/api/v1/search',search)

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const startServer = async () => {
    try {
        await Db();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
};

startServer();