from flask import Flask, request, jsonify
from flask_cors import CORS
from debate_engine import run_debate_turn
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


debates_store = {}

@app.route('/api/start_debate', methods=['POST'])
def start_debate():
    """
    Start a new debate with the provided topic, teams, and settings set by user.
    """
    data = request.json
    try:
        topic = data['topic']
        team1 = data['team1'] 
        team2 = data['team2']
        rounds = data.get('rounds', 3)
        points_per_round = data.get('points', 1)
        
        debate_id = str(len(debates_store) + 1)
        
        # Initialize debate state
        debates_store[debate_id] = {
            "topic": topic,
            "team1": team1,
            "team2": team2,
            "total_rounds": rounds,
            "points_per_round": points_per_round,
            "current_round": 1,
            "current_turn": "team1",
            "history": [],
            "status": "ongoing"
        }

        return jsonify({"debate_id": debate_id, "message": "Debate started successfully", "debate": debates_store[debate_id]})
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400





@app.route('/api/next_round', methods=['POST'])
def next_round():
    """
    Simulate the next round of the debate for the current team.
    """
    data = request.json
    debate_id = data.get('debate_id')
    
    # Validate debate ID, cant start next round if debate is completed, or if debate dosent exists
    if not debate_id or debate_id not in debates_store:
        return jsonify({"error": "Invalid or missing debate_id"}), 404
        
    debate = debates_store[debate_id]
    
    # Debare already completed, no more rounds to run
    if debate["status"] == "completed":
        return jsonify({"message": "Debate is already completed", "debate": debate})
        
    try:
        # Run argument for current turn
        turn = debate.get("current_turn", "team1")
        argument = run_debate_turn(debate, turn)
        
        if turn == "team1":
            debate["history"].append({
                "round": debate["current_round"],
                "team1_argument": argument,
                "team2_argument": None
            })
            debate["current_turn"] = "team2"
        else:
            debate["history"][-1]["team2_argument"] = argument
            debate["current_turn"] = "team1"
            debate["current_round"] += 1
            
            # Check if debate implies completion
            if debate["current_round"] > debate["total_rounds"]:
                debate["status"] = "completed"
            
        return jsonify({"message": "Turn completed", "debate": debate})
    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route('/api/debate/<debate_id>', methods=['GET'])
def get_debate(debate_id):
    """
    Get the current state of the debate by ID. 
    """
    if debate_id not in debates_store:
        return jsonify({"error": "Debate not found"}), 404
    return jsonify({"debate": debates_store[debate_id]})



if __name__ == '__main__':
    app.run(debug=True, port=8000)
