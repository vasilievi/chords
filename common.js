export const checkAuth = async () => {
    let res = await fetch('/api/checkAuth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: localStorage.getItem('user')
    });

    return(res.status === 200)

}