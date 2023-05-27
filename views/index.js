var expenseList = document.getElementById('listOfExpenses');

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
        const response = await axios.post('http://localhost:3000/expense/add-expense', myObj)
        showExpenseOnScreen(response.data.newExpenseDetail);
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err.response.data.message}</div>`
        console.error(err);
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get("http://localhost:3000/expense/get-expenses")
        for(let i=0; i<response.data.allExpenses.length; i++)
        showExpenseOnScreen(response.data.allExpenses[i]);
    } catch(error) {
        console.error(error);
    }
})

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
            await axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`)
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
            await axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`)
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
