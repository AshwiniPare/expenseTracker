var itemList = document.getElementById('items');

function saveToLocalStorage(event)
{
    event.preventDefault();
    
    const amount = event.target.expenseAmount.value;
    const desc = event.target.chooseDescription.value;
    const category = event.target.category.value;
   
    const myObj = {
        amount,
        desc,
        category
    }
    axios.post('http://localhost:3000/expense/add-expense', myObj)
    .then((response) => {
        showAmountOnScreen(response.data.newExpenseDetail);
        console.log(response)
    })
    .catch((err) => {
        document.body.innerHTML = document.body.innerHTML + "<h4> something is wrong</h4>"
        console.error(err);
    })   
}

window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:3000/expense/get-expenses")
        .then((response) => {
            console.log(response)

            for(let i=0; i<response.data.allExpenses.length; i++)
                showAmountOnScreen(response.data.allExpenses[i]);
        })
        .catch(error => console.error(error))
})

function showAmountOnScreen(obj) {
    const parentElem = document.getElementById('items');
    const childElem = document.createElement('li');
    childElem.class = "list-group-item";
    childElem.textContent = obj.amount+'-'+obj.desc+'-'+obj.category;

    let deleteBtn = document.createElement('input');
    deleteBtn.type = "button";
    deleteBtn.value ="Delete Expense ";
    deleteBtn.onclick = () => {
        console.log('for delete '+obj.id);
        axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`)
         .then((response) => {
             parentElem.removeChild(childElem);
         })
         .catch(error => console.error(error))
    }

    let editBtn = document.createElement('input');
    editBtn.type = "button";
    editBtn.value ="Edit Expense ";
    editBtn.onclick = () => {
        axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`)
            .then((response) => {
                parentElem.removeChild(childElem);
                document.getElementById('expenseAmount').value = obj.amount;
                document.getElementById('chooseDescription').value = obj.desc;
                document.getElementById('category').value = obj.category;
            })
            .catch(error => console.error(error))
    }

    childElem.appendChild(deleteBtn);
    childElem.appendChild(editBtn);
    parentElem.appendChild(childElem);
}
