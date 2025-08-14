# In backend/ai-engine/scripts/evaluate.py
import sys
import json

def evaluate_project(description):
    """
    Dummy LLM evaluation function.
    """
    novelty_score = 7 if "new" in description.lower() else 4
    feasibility_score = 8 if "prototype" in description.lower() else 5
    
    return {
        "novelty": "high" if novelty_score > 6 else "low",
        "feasibility": "high" if feasibility_score > 6 else "medium",
        "genuineness_confidence": 0.85,
        "suggested_budget": 10000,
        "passed_initial_screening": True
    }

if __name__ == "__main__":
    try:

        input_data = sys.stdin.read()
        
        if not input_data:
        
            print(json.dumps({"error": "No input received"}), file=sys.stderr)
            sys.exit(1)
            
        project_data = json.loads(input_data)
 
        result = evaluate_project(project_data.get("description", ""))
      
        print(json.dumps(result))

    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)