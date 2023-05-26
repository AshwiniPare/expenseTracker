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
        console.log("inside login");
        
            const response = await axios.post('http://localhost:3000/user/login', loginDetails);
            //console.log('response  is '+response.data);
            if(response.status === 200) {
                alert(response.data.message);
            } else {
                console.log('here');
                throw new Error(response.data.message);
            }
    } catch(err) {
            document.body.innerHTML += `<div style="color:red;">${err.message}</div>`
            console.error(JSON.stringify(err));
        } 
       
}

/*async function sendPostRequest(loginDetails) {
try {
    const response = await axios.post('http://localhost:3000/user/login', loginDetails);
    console.log('response  is '+response.data);
    if(response.status === 200) {
        alert(response.data.message);
    } else {
        console.log('here');
        throw new Error(response.data.message);
    }
}
catch(err) {
    document.body.innerHTML += `<div style="color:red;">${err.message}</div>`
    console.error(JSON.stringify(err));
}   
}*/