from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
embeddings_path = os.path.join(current_dir, "question_embeddings.pkl")

with open(embeddings_path, "rb") as f:
    question_embeddings = pickle.load(f)

# Recommendation system using cosine similarity
def recommend_questions(question_id, prev_questions, top_n=3):
    if question_id not in question_embeddings:
        return f"Question ID {question_id} not found."
    
    query_embedding = question_embeddings[question_id]
    similarities = {}
    
    prev_question_ids = {q['questionId'] for q in prev_questions}
    for q_id, embedding in question_embeddings.items():
        if q_id != question_id and q_id not in prev_question_ids:
            similarity = float(cosine_similarity(query_embedding, embedding)[0][0])
            similarities[q_id] = similarity
    
    # Sort by similarity
    sorted_similarities = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    
    # Get top N similar questions
    recommendations = [{"id": q_id, "similarity": sim} for q_id, sim in sorted_similarities[:top_n]]
    return recommendations

app = Flask(__name__)
CORS(app)

@app.route('/get-recommendation-from-tensor', methods=['POST'])
def recommend():
    data = request.get_json()
    question_id = data.get('question_id')
    prev_questions = data.get('prev_questions')
    top_n = int(data.get('top_n', 3))
    
    if not question_id:
        return jsonify({"error": "question_id is required"}), 400
    # if not prev_questions:
    #     return jsonify({"error": "prev_questions is required"}), 400
    
    if not isinstance(prev_questions, list):
        print(len(prev_questions))
        return jsonify({"error": "prev_questions must be a list"}), 400
    
    recommendations = recommend_questions(question_id, prev_questions, top_n)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, port=3001)