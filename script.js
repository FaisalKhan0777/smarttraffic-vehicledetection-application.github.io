//Faisal khan
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var originalImage = document.getElementById('originalImage');

    
    originalImage.src = "";

    // Load the model
    cocoSsd.load().then(model => {
        // Read and display the uploaded image
        var reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;

            // Perform object detection on the uploaded image
            var image = new Image();
            image.onload = function() {
                // Detect objects in the image
                model.detect(image).then(predictions => {
                    // Count vehicles and display the processed image with bounding boxes around detected objects
                    var vehicleCount = drawBoundingBoxes(image, predictions);
                    displayVehicleCount(vehicleCount);
                });
            };
            
            image.src = e.target.result;
        };
        reader.readAsDataURL(formData.get('imageFile'));
    });
});

function drawBoundingBoxes(imageElement, predictions) {
    var vehicleCount = 0;

    // Create a canvas to draw the bounding boxes
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    // Draw bounding boxes around detected objects
    predictions.forEach(prediction => {
        ctx.beginPath();
        ctx.rect(...prediction.bbox);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.stroke();
        ctx.fillText(`${prediction.class}: ${Math.round(prediction.score * 100)}%`, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : prediction.bbox[1] + 15);

        // Count vehicles
        if (prediction.class === 'car' || prediction.class === 'truck' || prediction.class === 'bus') {
            vehicleCount++;
        }
    });

    // Replace the faisal khan  processed image with the canvas containing the bounding boxes
    var processedImage = document.getElementById('processedImage');
    processedImage.src = canvas.toDataURL();

    return vehicleCount;
}

function displayVehicleCount(vehicleCount) {
    var countElement = document.getElementById('vehicleCount');
    countElement.innerText = `Total number of vehicles detected: ${vehicleCount}`;
}
