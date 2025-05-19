const app = require('./app');
const dotenv = require('dotenv');


dotenv.config();






// PORT
const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})

