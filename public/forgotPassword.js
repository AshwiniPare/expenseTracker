async function forgotPassword(event) {
    event.preventDefault();
   // console.log()
    const email = event.target.userEmail.value;
    const userDetails = {
        email
    }
console.log(userDetails);

try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://13.48.203.158:3000/password/forgotPassword',userDetails, { headers: {"Authorization": token}});
    document.body.innerHTML += '<div style="color:red;">Mail Successfully Sent</div>'
} catch(error) {
    document.body.innerHTML += `<div style="color:red;">${error} <div>`;
}
}