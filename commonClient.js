export const checkAuth = async () => {
    console.log('checkAuth');
    const res = await fetch('/api/checkAuth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: localStorage.getItem('user')
    });

    let result = false
    if (res.status === 200) {
        result = true
        const resJson = await res.json()
        localStorage.setItem('user', JSON.stringify(resJson.user))
    }

    return (result)

}

export const userId = () => {
    console.log('userId');
    const user = JSON.parse(localStorage.getItem('user'))
    let userId = ''
    if(user) userId = user._id
    return userId
}

export const token = () => {
    console.log('token');
    const user = JSON.parse(localStorage.getItem('user'))
    let token = ''
    if(user) token = user.token
    return token
}
