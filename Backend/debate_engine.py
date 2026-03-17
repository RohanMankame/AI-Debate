import os
import openai
def get_llm_response(model, prompt, temperature=0.7, max_tokens=250):
    model = model.lower()
    
    if "gpt" in model:
        client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    else:
        raise ValueError(f"Unsupported model: {model}")

def build_prompt(topic, team, opponent, history, points_per_round, is_first_team):
    history_text = ""
    for h in history:
        t1_name = team['name'] if is_first_team else opponent['name']
        t2_name = opponent['name'] if is_first_team else team['name']
        
        if h.get('team1_argument'):
            history_text += f"\n[{t1_name}]:\n{h['team1_argument']}\n"
        if h.get('team2_argument'):
            history_text += f"\n[{t2_name}]:\n{h['team2_argument']}\n"
        
    prompt = f"""You are a debater in a passionate, fast-paced live debate.
                Topic: {topic}
                Your Name: {team['name']}
                Your Viewpoint: {team['viewpoint']}
                Your Opponent's Name: {opponent['name']}

                Debate Transcript So Far:
                {history_text}

                Instructions:
                It is your turn to speak. Make {points_per_round} point(s) in your response.
                CRITICAL STYLE RULES:
                Be conversational, direct, and raw. Sound like a real person passionately arguing their side, not an AI generating an essay.
                Return ONLY your raw spoken words. No markdown, no headers, no bulleted lists. 
                Also dont repeat the same point multiple times. Make your points and move on.
            """
    return prompt

def run_debate_turn(debate, turn):
    topic = debate["topic"]
    team1 = debate["team1"]
    team2 = debate["team2"]
    history = debate["history"]
    points = debate.get("points_per_round", 1)
    
    if turn == "team1":
        active_team = team1
        opponent = team2
        is_first = True
    else:
        active_team = team2
        opponent = team1
        is_first = False
        
    prompt = build_prompt(topic, active_team, opponent, history, points, is_first)
    
    try:
        argument = get_llm_response(active_team["model"], prompt)
    except Exception as e:
        argument = f"[System Error: Failed to generate response from {active_team['model']}: {str(e)}]"
        
    return argument
