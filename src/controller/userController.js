
import { userService } from '../service/userService.js'
import { userModel } from '../model/userModel.js'
const signUp = async (req, res, next) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const newUser = await userService.signUp(req.body);
    res.status(201).send(newUser)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const verifyOtpSignUp = async (req, res, next) => {
  try {
    const newUser = await userService.verifyOtpSignUp(req.body)
    res.status(201).send(newUser)
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const signIn = async (req, res, next) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const loginUser = await userService.signIn(req.body);

    await res.cookie("access_token", loginUser.access_token, {
      httpOnly: true,
      maxAge: 60 * 1000,
      sameSite: "None",
      secure: true
    })
    await res.cookie("refresh_token", loginUser.refresh_token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    })
    //req.cookies[token] = loginUser.token
    const { access_token, refresh_token, ...result } = loginUser
    res.status(201).json(result)
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}

const getUser = async (req, res, next) => {
  try {
    const cookie = req.cookies["access_token"]
    const resfresh_cookie = req.cookies["refresh_token"]
    if (!cookie && !resfresh_cookie) {
      res.status(404).json("No token is Exist !")
    }
    else if (!cookie) {
      const access_cookie = await userService.getUser(resfresh_cookie)
        .then((results) => {
          const access_token = userModel.generateAcessToken({ id: results.id })
          res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 60 * 1000,
            sameSite: "None",
            secure: true
          })
          return access_token
        })

      const User = await userService.getUser(access_cookie)
      res.status(200).json(User)
    }
    else {
      const targetUser = await userService.getUser(cookie)
      res.status(200).json(targetUser)
    }

  } catch (e) {
    res.cookie("acess_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    })
    console.error("Error adding document: ", e);
  }
}
const logOut = async (req, res, next) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    });
    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    });
    res.status(200).json({ message: "logout success" })
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (req, res, next) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const newUser = await userService.update(req.body);
    res.status(201).send(newUser)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const updateData = async (req, res, next) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const checkEmail = await userService.updateData(req.body);
    res.status(201).send(checkEmail)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
export const userController = {
  signUp,
  signIn,
  getUser,
  logOut,
  verifyOtpSignUp,
  update, updateData
}