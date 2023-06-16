const token = localStorage.getItem('token');
var expenseList = document.getElementById('listOfExpenses');
const pagination = document.getElementById('pagination');
const recPerPageElement = document.getElementById('recPerPage')

async function addNewExpense(event)
{
    try {
        event.preventDefault();
        
        const amount = event.target.expenseAmount.value;
        const desc = event.target.chooseDescription.value;
        const category = event.target.category.value;
    
        const myObj = {
            amount,
            desc,
            category
        }
        
        const response = await axios.post('http://13.48.203.158:3000/expense/add-expense', myObj, { headers: {"Authorization": token}})
        showExpenseOnScreen(response.data.newExpenseDetail);
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err.response.data.message}</div>`
        console.error(err);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumUserMessage() {
    document.getElementById('rzp-button').style.visibility = "hidden";
    document.getElementById('downloadexpense').style.visibility = "visible";
    document.getElementById('message').innerHTML += "You are a Premium User now";
    showLeaderBoard();
}

function showLeaderBoard() {
    const inputElement = document.createElement('input');
    inputElement.type = "button";
    inputElement.value = "Show LeaderBoard";
    inputElement.onclick = async() => {
        const userLeaderBoardArray = await axios.get('http://13.48.203.158:3000/premium/showLeaderBoard', { headers: {"Authorization": token}})
        console.log(userLeaderBoardArray);

        var leaderBoardElem = document.getElementById('leaderBoard');
        leaderBoardElem.innerHTML += '<h4> Leader Board </h4>'
        for(userDetail of userLeaderBoardArray.data) {
            leaderBoardElem.innerHTML += `<li> Name - ${userDetail.name} - Total Expenses - ${userDetail.totalExpenses} </li>`
        }  
    }
    
    document.getElementById('message').appendChild(inputElement);
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        //document.getElementById('recPerPage').addEventListener("change", apply_pagination);
        const page = 1;
        const decodedToken = parseJwt(token);
        console.log(decodedToken);
        const isPremiumUser = decodedToken.isPremiumUser
        if(isPremiumUser) {
            showPremiumUserMessage();
        }
        getExpenses(page);
    } catch(error) {
        console.error(error);
    }
})

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    
    pagination.innerHTML = '';
    if(hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', () => getExpenses(previousPage));
        pagination.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', () => getExpenses(currentPage))
    pagination.appendChild(btn1);

    if(hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => getExpenses(nextPage))
        pagination.appendChild(btn3);
    }

}

async function getExpenses(page) {
    try {
        document.getElementById('listOfExpenses').innerHTML = "";
        const limit = localStorage.getItem('recPerPage') || 2;
        const response = await axios.get(`http://13.48.203.158:3000/expense/get-expenses?page=${page}&&limit=${limit}`, { headers: {"Authorization": token}})
        for(let i=0; i<response.data.allExpenses.length; i++)
            showExpenseOnScreen(response.data.allExpenses[i]);
        showPagination(response.data);
    } catch(error) {
        console.log(error);
    }
}

recPerPageElement.addEventListener("change", (event) => {
   let recPerPage = event.target.value;
   localStorage.setItem('recPerPage', recPerPage);
});

function showExpenseOnScreen(obj) {
    const parentElem = document.getElementById('listOfExpenses');
    const childElem = document.createElement('li');
    childElem.class = "list-group-item";
    childElem.textContent = obj.amount+'-'+obj.desc+'-'+obj.category;

    let deleteBtn = document.createElement('input');
    deleteBtn.type = "button";
    deleteBtn.value ="Delete Expense ";
    deleteBtn.onclick = async () => {
        try {
            await axios.delete(`http://13.48.203.158:3000/expense/delete-expense/${obj.id}`, { headers: {"Authorization": token}})
            parentElem.removeChild(childElem);
         } catch(error) { 
            console.error(error)
        }
    }

    let editBtn = document.createElement('input');
    editBtn.type = "button";
    editBtn.value ="Edit Expense ";
    editBtn.onclick = async () => {
        try {
            await axios.delete(`http://13.48.203.158:3000/expense/delete-expense/${obj.id}`, { headers: {"Authorization": token}})
            parentElem.removeChild(childElem);
            document.getElementById('expenseAmount').value = obj.amount;
            document.getElementById('chooseDescription').value = obj.desc;
            document.getElementById('category').value = obj.category;
        } catch(error) {
            console.error(error);
        } 
    }

    childElem.appendChild(deleteBtn);
    childElem.appendChild(editBtn);
    parentElem.appendChild(childElem);
}

document.getElementById('rzp-button').onclick = async(event) => {
    try {
        const response = await axios.get('http://13.48.203.158:3000/purchase/premiummembership', { headers: {"Authorization": token}});
        console.log("order id is ........" + response.data.order_id);
        console.log("response.razorpay_payment_id ..........."+response.razorpay_payment_id);
        var options = 
        {
            "key": response.data.key_id, //id from razorpay dashboard 
            "order_id": response.data.order_id, //for one time payment
            //this handler function will handle successful payment
            "handler": async function (response) {
                const res = await axios.post('http://13.48.203.158:3000/purchase/updatetransactionstatus',{
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                },{ headers: {"Authorization": token}})

                showPremiumUserMessage();
                alert('You are a premium user now');
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();

        rzp1.on('payment.failed', async function(response) {
            console.log(response);
            await axios.post('http://13.48.203.158:3000/purchase/updatefailedtransactionstatus',{
                    order_id: options.order_id
                },{ headers: {"Authorization": token}})
            alert('Transaction failed');
        });
    } catch(err) {
        console.error(err);
    }
}

async function download() {
    try {
        const response = await axios.get('http://13.48.203.158:3000/expense/download', {headers: {"Authorization": token}})
        var a =document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = 'myexpense.csv';
        a.click();
    } catch(err) {
        console.log(err);
    }
}