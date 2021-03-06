const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require('morgan');
const middleware = require("./utils/middleware");

const groupController = require("./controllers/group")
const jobController = require("./controllers/job")
const radiatorController = require("./controllers/radiator")
const authenticationController = require("./controllers/authentication")
const usersController = require("./controllers/users")
const jenkinsController = require("./controllers/jenkins")
const publicController = require("./controllers/public")
const jenkinsProxy = require("./controllers/jenkinsProxy")

const mongoUrl = process.env.MONGOURL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(middleware.getToken);
//mongoose.set('debug', true);

app.use("/api/radiator/group", groupController)
app.use("/api/radiator/job", jobController)
app.use("/api/radiator", radiatorController)
app.use("/api/auth", authenticationController)
app.use("/api/users", usersController)
app.use("/api/jenkins", jenkinsController)
app.use("/api/public", publicController)
app.use("/api/proxy", jenkinsProxy)

//TODO: Error handlers
app.use(middleware.errorHandler);


const listenPort = process.env.PORT || 3003;
app.listen(listenPort, () => {
  console.log(`Server running on port ${listenPort}`)
});