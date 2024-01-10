document.addEventListener('DOMContentLoaded', init);

function init() {
    loadExpenses();
    loadUserDetails();
    document.getElementById('expenseForm').addEventListener('submit', addExpense);

//    // Add event listener for the edit form
//     document.getElementById('editExpenseForm').addEventListener('submit', editExpense);

}

function loadUserDetails() {
    // Make a GET request to crudcrud.com using Axios to retrieve user details
    axios.get('https://crudcrud.com/api/68c1ecefef6744faa9de5117f4caff61/employeedata')
        .then((response) => {
        // Handle the successful response if needed
        console.log('Expense added successfully:', response.data);

        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        })

            // // You can choose to do something with the response data if necessary
            // // For example, you might update the UI with the user details

            // // Display user details on the website (replace 'userDetailsContainer' with your container id)
            // const description = document.getElementById('description').value;
            // const category = document.getElementById('category').value;
            // const amount = parseFloat(document.getElementById('amount').value);
            
            // // Assuming your user details are an array, you may need to loop through them
            // response.data.forEach(description => {
            //     const Description = document.createElement('div');
            //     Description.textContent = `Description: ${description.text}`;
            //     description.appendChild(Description);
        .catch((error) => {
            // Handle the error if the GET request fails
            console.error('Error loading user details:', error);

            // You might want to display an error message to the user
            alert('Failed to load user details. Please try again.');

        });
        
}

function addExpense(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount) || amount <= 0 || !description.trim()) {
        alert('Please enter a valid description and amount.');
        return;
    }

    const expense = {
        description,
        amount,
        category,
    };

    // Make a POST request to crudcrud.com using Axios
    axios.post('https://crudcrud.com/api/68c1ecefef6744faa9de5117f4caff61/employeedata', expense)
        .then(response => {
            // Handle the successful response if needed
            console.log('Expense added successfully:', response.data);

            document.getElementById('description').value = '';
            document.getElementById('amount').value = '';
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            alert('Failed to add expense. Please try again.');
        });
}


function loadExpenses() {
    const expenses = getExpenses();
    renderExpenses(expenses);
}

function renderExpenses(expenses) {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';

        expenseItem.innerHTML = `
            <span>${expense.description}</span>
            <span>${expense.category}</span>
            <span>$${expense.amount.toFixed(2)}</span>
            <button class="btn btn-danger delete-btn" onclick="deleteExpense(${expense.id})">Delete Expense</button>
            <button class="btn btn-warning edit-btn" data-toggle="modal" data-target="#editExpenseModal" onclick="prepareEditForm(${expense.id}, '${expense.description}', ${expense.amount})">Edit Expense</button>
        `;

        expenseList.appendChild(expenseItem);
    });
}

function deleteExpense(expenseId) {
    const expenses = getExpenses().filter(expense => expense.id !== expenseId);
    saveExpenses(expenses);
    renderExpenses(expenses);
}

// Function to prepare the edit form with existing expense data
function prepareEditForm(id, description, amount, category) {
    document.getElementById('editExpenseId').value = id;
    document.getElementById('editDescription').value = description;
    document.getElementById('editAmount').value = amount;
    document.getElementById('editCategory').value = category;
}

// Function to handle the editing of expenses
function editExpense(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('editExpenseId').value);
    const description = document.getElementById('editDescription').value;
    const amount = parseFloat(document.getElementById('editAmount').value);
    const category = document.getElementById('editCategory').value;

    if (isNaN(amount) || amount <= 0 || !description.trim()) {
        alert('Please enter a valid description and amount.');
        return;
    }

    const expenses = getExpenses().map(expense => (expense.id === id ? { ...expense, description, amount, category } : expense));
    saveExpenses(expenses);
    renderExpenses(expenses);

    // Clear the edit form and close the modal
    document.getElementById('editExpenseForm').reset();
    $('#editExpenseModal').modal('hide');
}

function getExpenses() {
    const expensesString = localStorage.getItem('expenses');
    return expensesString ? JSON.parse(expensesString) : [];
}

function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}