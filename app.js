// Toggle Login vs Forgot Password UI
function toggleForgotPass(showForgot) {
    const loginForm = document.getElementById('loginForm');
    const forgotForm = document.getElementById('forgotForm');
    
    if (showForgot) {
        loginForm.style.display = 'none';
        forgotForm.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        forgotForm.style.display = 'none';
    }
}

// Handle Login Form Submission
// Handle Login Form Submission via API
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            });

            const result = await response.json();

            if (result.success) {
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Server error. Ensure Node server is running.');
        }
    });
}
/*const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Skeleton logic: simulate successful login
        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
    });
}*/

// Redirect to update.html with selected table parameter
function goToUpdate(tableName) {
    window.location.href = `update.html?table=${tableName}`;
}

// Skeleton function for Delete action
function deleteTableRecord(tableName) {
    if (confirm(`Are you sure you want to delete entries from ${tableName}?`)) {
        alert(`Delete command triggered for ${tableName}. (Backend connection required)`);
    }
}

// Dynamically generate form inputs based on selected table schema
function loadUpdateForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const tableName = urlParams.get('table');
    const dynamicFields = document.getElementById('dynamicFields');
    const updateTitle = document.getElementById('updateTitle');

    if (!tableName || !dynamicFields) return;

    updateTitle.innerText = `Update ${tableName}`;

    // Schema attributes mapped for GUI generation
    const schemas = {
        'Categories': ['CategoryID', 'CategoryName'],
        'Suppliers': ['SupplierID', 'SupplierName', 'ContactPhone'],
        'Parts': ['PartID', 'PartName', 'PartNumber', 'UnitPrice', 'CategoryID', 'SupplierID'],
        'Inventory': ['InventoryID', 'PartID', 'QuantityInStock', 'LastRestockDate']
    };

    const fields = schemas[tableName] || [];
    
    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';
        
        const label = document.createElement('label');
        label.innerText = field;
        
        const input = document.createElement('input');
        input.type = field.toLowerCase().includes('date') ? 'date' : 'text';
        input.name = field;
        input.required = true;
        input.placeholder = `Enter ${field}`;

        div.appendChild(label);
        div.appendChild(input);
        dynamicFields.appendChild(div);
    });
}