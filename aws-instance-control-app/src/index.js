const express = require('express');
const bodyParser = require('body-parser');
const instanceRoutes = require('./routes/instanceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/instances', instanceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});