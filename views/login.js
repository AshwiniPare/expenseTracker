async function login(event)
{
    try {
        event.preventDefault();

        const email = event.target.userEmail.value;
        const password = event.target.userPassword.value;
    
        const loginDetails = {
            email,
            password
        }
        
        const response = axios.post('http://localhost:3000/user/login', loginDetails);
        if(response.status === 200) {
            alert(response.data.message);
        } else {
            throw new Error(response.data.message);
        }
    }
    catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>`
        console.error(JSON.stringify(err));
    }   
}
