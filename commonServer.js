import dbConnect from './lib/dbConnect'
import User from './models/User'

export const checkToken = async (token) => {
    console.log('checkToken');
    await dbConnect()
    const user = await User.findOne({ token: token })
    let result = false
    if(user) result = true
    return(result)
}
