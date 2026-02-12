import numpy as np
import tensorflow as tf
from tensorflow.keras import models
import cv2

class GradCAM:
    """Grad-CAM for medical image explainability"""
    
    def __init__(self):
        self.last_conv_layer_name = "densenet121"  # Adjust based on model
        
    def generate_heatmap(self, image_array, model, class_idx=None):
        """Generate Grad-CAM heatmap"""
        if image_array is None:
            return None
            
        # Ensure correct shape
        if len(image_array.shape) == 3:
            image_array = np.expand_dims(image_array, axis=0)
            
        # Get the last convolutional layer
        grad_model = models.Model(
            inputs=model.image_model.input,
            outputs=[
                model.image_model.get_layer(self.last_conv_layer_name).output,
                model.image_model.output
            ]
        )
        
        # Compute gradients
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(image_array)
            if class_idx is None:
                class_idx = tf.argmax(predictions[0])
            loss = predictions[:, class_idx]
            
        # Gradients
        grads = tape.gradient(loss, conv_outputs)
        
        # Global average pooling
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Weight the convolutional outputs
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(
            tf.multiply(pooled_grads, conv_outputs), axis=-1
        )
        
        # Normalize
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        heatmap = heatmap.numpy()
        
        # Resize to original image size
        heatmap = cv2.resize(heatmap, (224, 224))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        return heatmap

class SHAPExplainer:
    """SHAP values for tabular explainability"""
    
    def explain(self, patient_data, diagnosis):
        """Generate SHAP-like feature importance"""
        
        features = {}
        
        # Calculate contribution scores
        vitals = patient_data.get('vitals', {})
        
        features['glucose'] = {
            'value': vitals.get('glucose', 120),
            'contribution': self._calculate_contribution(
                vitals.get('glucose', 120), 
                [70, 140], 
                0.28
            )
        }
        
        features['heart_rate'] = {
            'value': vitals.get('heart_rate', 80),
            'contribution': self._calculate_contribution(
                vitals.get('heart_rate', 80),
                [60, 100],
                0.18
            )
        }
        
        features['spo2'] = {
            'value': vitals.get('spo2', 98),
            'contribution': self._calculate_contribution(
                vitals.get('spo2', 98),
                [95, 100],
                0.21
            )
        }
        
        return features
    
    def _calculate_contribution(self, value, normal_range, base_weight):
        """Calculate feature contribution based on deviation from normal"""
        low, high = normal_range
        
        if low <= value <= high:
            return base_weight * 0.3  # Normal range - lower contribution
        elif value < low:
            deviation = (low - value) / low
            return base_weight * (1 + deviation)
        else:
            deviation = (value - high) / high
            return base_weight * (1 + deviation)