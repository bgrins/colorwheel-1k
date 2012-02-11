
(function() {

    // Declare constants and variables to help with minification
    var width = c.width = c.height = 400,
        circleOffset = 10,
        diameter = width - 20,
        radius = diameter / 2,
        radiusSquared = radius * radius,
        two55 = 255,
        oneHundred = 100,
        currentX = -80,
        currentY = 80,
        wheelPixel = circleOffset*4*width+circleOffset*4;
    
    // Math helpers
    var math = Math,
        PI = math.PI,
        PI2 = PI * 2,
        cos = math.cos,
        sqrt = math.sqrt,
        atan2 = math.atan2;
    
    // DOM elements
    var doc = document,
        imageData = a.createImageData(width, width),
        pixels = imageData.data,
        label = createChild("p"),
        input = createChild("input");
    
    // Setup DOM
    b.style.cssText="margin:0;text-align:center";
    label.style.cssText = "font:32px monospace;background:#fff;";
    input.type = "range";
    input.min = 0;
    input.value = input.max = oneHundred;
    
    // font:32px Consolas,Monaco,monospace; This looks a little nicer
    
    // Load color wheel data into memory.
    for (y = 0; y < width; y++) {
        for (x = 0; x < width; x++) {
            var rx = x - radius,
                ry = y - radius,
                d = rx * rx + ry * ry,
                rgb = hsvToRgb(
                    (atan2(ry, rx) + PI) / PI2,     // Hue
                    sqrt(d) / radius,               // Saturation
                    1                               // Value
                );

            // Print current color, but hide if outside the area of the circle
            pixels[wheelPixel++] = rgb[0];
            pixels[wheelPixel++] = rgb[1];
            pixels[wheelPixel++] = rgb[2];
            pixels[wheelPixel++] = d <= radiusSquared ? two55 : 0;
        }
    }
    
    rx = ry = -80;
    
    // Bind Event Handlers
    c.onmousedown = doc.onmouseup = function(e) {
        // Unbind mousemove if this is a mouseup event, or bind mousemove if this a mousedown event
        doc.onmousemove = (/p/.test(e.type)) ? 0 : (redraw(e), redraw);
    }
    input.onchange = redraw;

    // Handle manual calls + mousemove event handler + input change event handler all in one place.
    function redraw(e) { 
        
        // Only process an actual change if it is triggered by the mousemove event.  Otherwise just update UI.
        currentX = e.pageX - c.offsetLeft - radius - circleOffset || currentX;
        currentY = e.pageY - c.offsetTop - radius - circleOffset  || currentY;
        
        var theta = atan2(currentY, currentX),
            d = currentX * currentX + currentY * currentY;
        
        // If the x/y is not in the circle, find angle between center and mouse point:
        //   Draw a line at that angle from center with the distance of radius
        //   Use that point on the circumference as the draggable location
        if (d >= radiusSquared) {
            currentX = radius * cos(theta);
            currentY = radius * cos(theta - PI/2); // Replaced math.sin(theta)
            theta = atan2(currentY, currentX);
            d = currentX * currentX + currentY * currentY;
        }
        
        label.textContent = b.style.background = hsvToRgb(
            (theta + PI) / PI2,         // current hue
            sqrt(d) / radius,           // current saturation 
            input.value / oneHundred    // current value
        )[3];
        
        
        //var rgb = a.getImageData(X + radius + circleOffset, Y + radius + circleOffset, 1, 1).data;
        //label.textContent = b.style.background = "rgb("+ rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
        
        // Reset to color wheel and draw a spot on the current location. 
        a.putImageData(imageData, 0, 0);
        
        // Could be a rectangle, circle, or heart shape.
        // Circle:
        a.beginPath();  
        a.strokeStyle = '#000';
        a.arc(~~currentX+radius+circleOffset,~~currentY+radius+circleOffset,4,0,PI2);
        a.stroke();
        
        /*
        // Rectangle:
        //a.fillStyle = '#000';
        //a.fillRect(~~currentX+radius+circleOffset,~~currentY+radius+circleOffset, 10, 10);
        
        // Heart shape:
        a.font = "12px serif";
        a.fillText("♥", ~~currentX+radius+circleOffset,~~currentY+radius+circleOffset);
        */
    }
    
    // https://github.com/bgrins/TinyColor/blob/master/tinycolor.js
    function hsvToRgb(h, s, v) {
        h *= 6;
        
        var i = ~~h,
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod] * two55,
            g = [t, v, v, q, p, p][mod] * two55,
            b = [p, p, t, v, v, q][mod] * two55;
            
        return [r, g, b, "rgb("+ ~~r + "," + ~~g + "," + ~~b + ")"];
    }
    
    // Smallest reusable way I could think of for creating a child node.
    function createChild(el) {
      return b.appendChild(doc.createElement(el));
    }
    
    // Kick everything off
    redraw(0);
    
    // Just an idea I had to kick everything off with some changing colors…
    //var startX = -200;
    //var startY = -200;
    //var interval = setInterval(function() {
    //    change({ pageX: startX++, pageY: startY++ })
    //}, 1);

})();