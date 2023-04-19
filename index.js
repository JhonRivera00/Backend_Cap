import app from './src/app.js';
import { PORT } from './src/config.js';
import './src/db.js';

app.use((req, res, next)=>{
    return res.status(405).json("Cap proyecto")
})

app.listen(PORT, ()=>{
    console.log(`Servidor en puerto ${PORT}`);
});