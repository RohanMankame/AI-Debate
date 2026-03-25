import os
import openai


def get_llm_response(model, prompt, temperature=0.7, max_tokens=250):
    """
    Get a response from the specified LLM model based on the provided prompt.
    Currently only supports OpenAI's GPT models as I do not have tokens for the other LLM Providers.
    """
    model = model.lower()
    
    if "gpt" in model:
        # For OpenAI GPT models, use the OpenAI API to get a response
        client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    elif "gemini" in model:
        # Placeholder for Google Gemini API integration
        raise NotImplementedError(f"Google Gemini {model} model integration is not implemented yet.")
    
    elif "claude" in model:
        # Placeholder for Anthropic Claude API integration
        raise NotImplementedError(f"Anthropic Claude {model} model integration is not implemented yet.")
    
    else:
        raise ValueError(f"Unsupported model: {model}")
    



def build_prompt(topic, team, opponent, history, points_per_round, is_first_team):
    """
    Prompt for the LLM based on the current debate state.
    The prompt includes the debate topic, team information, and the history of arguments so far.
    """
    history_text = ""
    for h in history:
        # Determine team names based on whether the current team is team1 or team2
        t1_name = team['name'] if is_first_team else opponent['name']
        t2_name = opponent['name'] if is_first_team else team['name']
        
        # Format the history with team names and their respective arguments
        if h.get('team1_argument'):
            history_text += f"\n[{t1_name}]:\n{h['team1_argument']}\n"
        if h.get('team2_argument'):
            history_text += f"\n[{t2_name}]:\n{h['team2_argument']}\n"
        
    # Build the prompt for the LLM
    personality_instruction = f"\nPERSONALITY & STYLE: {team['personality']}\nYou MUST strictly adhere to this personality in your response." if team.get('personality') else ""
    
    prompt = f"""You are a debater in a passionate, fast-paced live debate.
                Topic: {topic}
                Your Name: {team['name']}
                Your Viewpoint: {team['viewpoint']}
                {personality_instruction}
                Your Opponent's Name: {opponent['name']}

                DEBATE HISTORY SO FAR:
                {history_text}

                INSTRUCTION:
                It is your turn to speak. Make {points_per_round} point(s) in your response.

                CRITICAL STYLE RULES:
                1. Be direct, raw, and focused on winning the debate. 
                2. Sound like a real person passionately arguing their side, not an AI generating an essay.
                3. Return ONLY your raw spoken words. No markdown, no headers, no bulleted lists. 
                4. Do not repeat a previous point, only make new points that advance your argument or refute your opponent.
                5. EMBODY YOUR ASSIGNED PERSONALITY COMPLETELY. If you are aggressive, be aggressive. If you are sarcastic, be sarcastic.
            """
    return prompt



def run_debate_turn(debate, turn):
    """
    Simulate a single turn of the debate for the given team.
    """
    # Extract current debate information
    topic = debate["topic"]
    team1 = debate["team1"]
    team2 = debate["team2"]
    history = debate["history"]
    points = debate.get("points_per_round", 1)
    

    # Determine active team and opponent based on the current turn
    if turn == "team1":
        active_team = team1
        opponent = team2
        is_first = True
    else:
        active_team = team2
        opponent = team1
        is_first = False
        
    # Get Built prompt
    prompt = build_prompt(topic, active_team, opponent, history, points, is_first)
    
    # Get LLM response for the current turn and return it
    try:
        argument = get_llm_response(active_team["model"], prompt)

    except Exception as e:
        argument = f"[System Error: Failed to generate response from {active_team['model']}: {str(e)}]"
        
    return argument


def run_judge_verdict(debate):
    """
    Evaluates the entire debate history and chooses a winner.
    """
    topic = debate["topic"]
    team1 = debate["team1"]
    team2 = debate["team2"]
    history = debate["history"]
    judge_model = debate.get("judge_model", "gpt-4o-mini")

    full_transcript = ""
    for h in history:
        full_transcript += f"Round {h['round']}:\n"
        full_transcript += f"[{team1['name']}]: {h['team1_argument']}\n"
        full_transcript += f"[{team2['name']}]: {h['team2_argument']}\n\n"

    judge_prompt = f"""You are an expert debate judge. Your task is to evaluate the following debate and declare a clear winner.

    DEBATE TOPIC: {topic}
    
    CONTESTANTS:
    Team 1: {team1['name']} (Viewpoint: {team1['viewpoint']})
    Team 2: {team2['name']} (Viewpoint: {team2['viewpoint']})

    FULL DEBATE TRANSCRIPT:
    {full_transcript}

    JUDGING CRITERIA:
    1. Clarity and logic of arguments.
    2. How well they refuted the opponent's points.
    3. Persuasiveness and evidence-based reasoning.
    4. Adherence to their assigned persona/personality.

    RESPONSE FORMAT:
    Provide your verdict in this exact format:
    WINNER: [Team Name]
    REASONING: [Brief explanation for why they won, citing specific points from the debate]
    Final verdict must be direct and decisive.
    """

    try:
        verdict = get_llm_response(judge_model, judge_prompt, temperature=0.3, max_tokens=500)
    except Exception as e:
        verdict = f"WINNER: TIE\nREASONING: The judge encountered an error during deliberation: {str(e)}"

    return verdict
