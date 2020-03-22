require('dotenv').config();
const app = require('./server.js');

port = process.env.PORT

app.listen(port, () => {
    console.log(`**********Server running on localhost:${port}**********`);
});
