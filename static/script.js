document.getElementById('premium-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    
    // Show a loading state to the user
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Calculating...';
    resultDiv.style.opacity = 1;
    resultDiv.style.animation = 'none'; // Stop the pulse animation while loading

    const data = {
        age: parseInt(form.age.value),
        gender: form.gender.value,
        isSmoker: form.is_smoker.value === 'true',
        sumAssured: parseInt(form.sum_assured.value) * 100000,
        policyTerm: parseInt(form.policy_term.value)
    };

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            resultDiv.textContent = 'Error: ' + result.error;
            resultDiv.style.color = '#dc3545';
        } else {
            resultDiv.textContent = `Estimated Annual Premium: ₹${result.premium.toLocaleString('en-IN')}`;
            resultDiv.style.color = '#28a745';
            resultDiv.style.animation = 'pulse 2s infinite'; // Re-start the animation
        }
        resultDiv.style.opacity = 1;
    })
    .catch(error => {
        resultDiv.textContent = 'An error occurred. Please try again.';
        resultDiv.style.color = '#dc3545';
        console.error('Error:', error);
    });
});