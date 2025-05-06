import React, { useState, useRef, useEffect } from "react";
import "./ColorPicker.css";

function ColorPicker() {
  const [solidColor, setSolidColor] = useState("#3498db");
  const [gradient, setGradient] = useState({
    color1: "#ff6a00",
    color2: "#ee0979",
    direction: "to right",
  });
  const [savedColors, setSavedColors] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#3498db"); // Color of the pen tool
  const canvasRef = useRef(null); // Reference to the canvas element
  const ctxRef = useRef(null); // Reference to the canvas context

  useEffect(() => {
    // Initialize the canvas context on mount
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    ctx.lineWidth = 5; // Set default pen width
    ctx.lineCap = "round"; // Smooth rounded ends of the line
    ctx.strokeStyle = penColor; // Set initial pen color
  }, [penColor]);

  const resetColors = () => {
    setSolidColor("#3498db");
    setGradient({
      color1: "#ff6a00",
      color2: "#ee0979",
      direction: "to right",
    });
  };

  const saveColor = () => {
    setSavedColors([...savedColors, { solidColor, gradient }]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("✅ Copied to clipboard:\n" + text);
  };

  const gradientString = `linear-gradient(${gradient.direction}, ${gradient.color1}, ${gradient.color2})`;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  };

  return (
    <>
      <header>
        <h1>🎨 Color Picker Tool</h1>
        <p>
          Pick solid or gradient colors, save them, and copy the color code
          instantly! You can also draw with the pen tool.
        </p>
      </header>

      <div className="main-container">
        {/* Solid Color Picker */}
        <div className="picker-box">
          <h2>🎨 Solid Color Picker</h2>
          <input
            className="color-input"
            type="color"
            value={solidColor}
            onChange={(e) => setSolidColor(e.target.value)}
          />
          <label>Color Code:</label>
          <input
            className="code-display"
            type="text"
            value={solidColor}
            readOnly
            onClick={() => copyToClipboard(solidColor)}
            title="Click to copy!"
          />
          <div
            className="color-preview"
            style={{ backgroundColor: solidColor }}
            title={solidColor}
          />
        </div>

        {/* Gradient Color Picker */}
        <div className="picker-box">
          <h2>🌈 Gradient Color Picker</h2>
          <div className="gradient-inputs">
            <input
              type="color"
              value={gradient.color1}
              onChange={(e) =>
                setGradient({ ...gradient, color1: e.target.value })
              }
            />
            <input
              type="color"
              value={gradient.color2}
              onChange={(e) =>
                setGradient({ ...gradient, color2: e.target.value })
              }
            />
          </div>
          <div className="direction-input">
            <select
              value={gradient.direction}
              onChange={(e) =>
                setGradient({ ...gradient, direction: e.target.value })
              }
            >
              <option value="to right">Left → Right</option>
              <option value="to left">Right → Left</option>
              <option value="to bottom">Top → Bottom</option>
              <option value="to top">Bottom → Top</option>
              <option value="45deg">45° Angle</option>
              <option value="135deg">135° Angle</option>
            </select>
          </div>
          <label>Gradient Code:</label>
          <input
            className="code-display"
            type="text"
            value={gradientString}
            readOnly
            onClick={() => copyToClipboard(gradientString)}
            title="Click to copy!"
          />
          <div
            className="color-preview"
            style={{ background: gradientString }}
            title={gradientString}
          />
        </div>
      </div>

      {/* Buttons and Saved Colors */}
      <div className="actions-container">
        <div className="actions">
          <button className="save-button" onClick={saveColor}>
            💾 Save Color
          </button>
          <button className="reset-button" onClick={resetColors}>
            🔄 Reset
          </button>
        </div>

        {savedColors.length > 0 && (
          <div className="saved-colors">
            <h3>Saved Colors:</h3>
            <div className="saved-colors-list">
              {savedColors.map((color, index) => (
                <div
                  key={index}
                  className="saved-color"
                  style={{
                    background: `linear-gradient(${color.gradient.direction}, ${color.gradient.color1}, ${color.gradient.color2})`,
                  }}
                  title={`Gradient: ${color.gradient.direction}, ${color.gradient.color1}, ${color.gradient.color2}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ColorPicker;
