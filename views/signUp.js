async function signUp(event)
{
    try {
        event.preventDefault();
        
        const name = event.target.userName.value;
        const email = event.target.userEmail.value;
        const password = event.target.userPassword.value;
    
        const signUpDetails = {
            name,
            email,
            password
        }
        
        const response = axios.post('http://localhost:3000/user/add-user', signUpDetails);
       /* if(response.status === 201) {

        } else {
            throw new Error('Failed to login');
        }*/
    }
    catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err}</div>`
        console.error(err);
    }   
}
