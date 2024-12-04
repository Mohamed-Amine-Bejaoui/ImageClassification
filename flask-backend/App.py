from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
from flask_cors import CORS
from flask_cors import CORS


app = Flask(__name__)
CORS(app) 

model = tf.keras.models.load_model('model/model.keras')  

@app.route('/')
def home():
    return "AI Flask Backend is running!"

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file found in the request'}), 400
        
        file = request.files['image']
        
        # Open the image file and preprocess it
        image = Image.open(file)
        image = image.convert('RGB')  # Convert to RGB if the model expects 3 channels
        
        # Resize to the model's expected input size (255, 255 is just an example)
        image = image.resize((255, 255)) 
        
        # Convert image to a numpy array and normalize the pixel values
        image = np.array(image) / 255.0  # Normalize pixel values to [0, 1]
        
        # Ensure the image has the batch dimension (1, 255, 255, 3)
        image = np.expand_dims(image, axis=0)
        
        # Make a prediction
        prediction = model.predict(image)
        
        # Assuming binary classification (e.g., Happy vs Sad)
        predicted_class = "Sad" if prediction[0][0] > 0.5 else "Happy"
        
        # Return only the prediction as a JSON response
        return jsonify({
            'prediction': predicted_class,
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
