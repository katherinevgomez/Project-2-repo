///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

///////////////////////////////
// Custom Middleware Functions
////////////////////////////////

// Middleware to check if userId is in sessions and create req.user
const addUserToRequest = async (req, res, next) => {
  if (req.session.userId) {
    req.user = await User.findById(req.session.userId)
    next()
  } else {
    next()
  }
}

// Auth Middleware Function to check if user authorized for route
const isAuthorized = (req, res, next) => {
  // check if user session property exists, if not redirect back to login page
  if (req.user) {
    //if user exists, wave them by to go to route handler
    next()
  } else {
    //redirect the not logged in user
    res.redirect("/auth/login")
  }
}

///////////////////////////////
// Router Specific Middleware
////////////////////////////////

router.use(addUserToRequest)

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", (req, res) => {
  res.render("home")
})

// AUTH RELATED ROUTES

//SIGNUP ROUTES
router.get("/auth/signup", (req, res) => {
  res.render("auth/signup")
})

router.post("/auth/signup", async (req, res) => {
  try {
    // generate salt for hashing
    const salt = await bcrypt.genSalt(10)
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, salt)
    // Create the User
    await User.create(req.body)
    // Redirect to login page
    res.redirect("/auth/login")
  } catch (error) {
    res.json(error)
  }
})

//Login ROUTES
router.get("/auth/login", (req, res) => {
  res.render("auth/login")
})

router.post("/auth/login", async (req, res) => {
  try {
    //check if the user exists (make sure to use findOne not find)
    const user = await User.findOne({ username: req.body.username })
    if (user) {
      // check if password matches
      const result = await bcrypt.compare(req.body.password, user.password)
      if (result) {
        // create user session property
        req.session.userId = user._id
        //redirect to /goals
        res.redirect("/picture")
      } else {
        // send error is password doesn't match
        res.json({ error: "passwords don't match" })
      }
    } else {
      // send error if user doesn't exist
      res.json({ error: "User does not exist" })
    }
  } catch (error) {
    res.json(error)
  }
})

//Logout Route
router.get("/auth/logout", (req, res) => {
  // remove the user property from the session
  req.session.userId = null
  // redirect back to the main page
  res.redirect("/")
})

// Pictures Index Route render view (we will include new form on index page) (protected by auth middleware)
router.get("/picture", isAuthorized, async (req, res) => {
  console.log(req.user)
  // render template passing it list of pictures
  res.render("picture", {
    pictures: req.user.pictures,
  })
})

// Pictures create route when form submitted
router.post("/picture", isAuthorized, async (req, res) => {
  // fetch up to date user
  const user = await User.findOne({ username: req.user.username })
  // push new goal and save
  user.pictures.push(req.body)
  await user.save()
  // redirect back to pictures index
  res.redirect("/picture")
})
///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router