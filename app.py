from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# The core weighted calculation algorithm
def calculate_premium(age, gender, is_smoker, sum_assured, policy_term):
    base_premium = 5000  # Base rate for a young, healthy individual
    
    # Weighted factors
    age_factor = 1.0 + (age - 20) * 0.03 if age > 20 else 1.0
    gender_factor = 0.95 if gender.lower() == 'female' else 1.0
    smoker_factor = 1.5 if is_smoker else 1.0
    sa_factor = sum_assured / 1000000 
    term_factor = 1.0 + (policy_term - 10) * 0.02 if policy_term > 10 else 1.0
    
    premium = base_premium * age_factor * gender_factor * smoker_factor * sa_factor * term_factor
    
    return round(premium, 2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def handle_calculation():
    try:
        data = request.get_json()
        
        age = data['age']
        gender = data['gender']
        is_smoker = data['isSmoker']
        sum_assured = data['sumAssured']
        policy_term = data['policyTerm']

        premium = calculate_premium(age, gender, is_smoker, sum_assured, policy_term)
        
        return jsonify({'premium': premium})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)