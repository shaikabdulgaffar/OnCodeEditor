// Language switching functionality
function switchToPython() {
  window.open('../Python_Code_Editor/index.html', '_blank');
}

function switchToSql() {
  window.open('../SQL_Code_Editor/index.html', '_blank');
}

function switchToHtmlcssjs() {
  window.open('../HTMLCSSJS_Code_Editor/index.html', '_blank');
}

function switchToJS() {
  // Already in JS mode
  document.getElementById('code').placeholder = '// Write JavaScript code here...';
  updateActiveButton('JavaScript');
}

function updateActiveButton(lang) {
  const buttons = document.querySelectorAll('.lang-buttons button');
  buttons.forEach(btn => {
    if (btn.textContent.includes(lang)) {
      btn.classList.add('active-lang');
    } else {
      btn.classList.remove('active-lang');
    }
  });
}

// Initialize with JS as active
updateActiveButton('JavaScript');

// JavaScript execution
function runCode() {
  const code = document.getElementById("code").value;
  const outputArea = document.getElementById("output");
  
  try {
    // Backup original console.log
    const originalConsoleLog = console.log;
    let output = "";
    
    // Override console.log to capture output
    console.log = function() {
      for (let i = 0; i < arguments.length; i++) {
        output += arguments[i] + ' ';
      }
      output += '\n';
      originalConsoleLog.apply(console, arguments);
    };
    
    // Execute the code
    const result = new Function(code)();
    
    // If the code returns something (not just console.log)
    if (result !== undefined) {
      output += result;
    }
    
    // Restore original console.log
    console.log = originalConsoleLog;
    
    outputArea.textContent = output || "Code executed with no output";
  } catch (err) {
    outputArea.textContent = err.stack || String(err);
  }
}

function copyCode() {
  const code = document.getElementById("code");
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code.value)
      .then(() => showNotification("Code copied to clipboard!"))
      .catch(err => showNotification("Failed to copy: " + err.message, true));
  } else {
    // Fallback for older browsers
    code.select();
    code.setSelectionRange(0, 99999);
    try {
      const successful = document.execCommand('copy');
      showNotification(successful ? "Code copied!" : "Copy failed", !successful);
    } catch (err) {
      showNotification("Copy not supported: " + err.message, true);
    }
  }
}

function clearOutput() {
  document.getElementById("output").textContent = ">";
}

// Line Numbers and Stats Update
function updateLineNumbers() {
  const code = document.getElementById('code');
  const lineNumbers = document.getElementById('lineNumbers');
  const lineCount = document.getElementById('lineCount');
  const charCount = document.getElementById('charCount');
  
  const lines = code.value.split('\n');
  const numLines = lines.length;
  
  // Update line numbers
  let lineNumbersText = '';
  for (let i = 1; i <= numLines; i++) {
    lineNumbersText += i + '\n';
  }
  lineNumbers.textContent = lineNumbersText;
  
  // Update stats
  lineCount.textContent = numLines;
  charCount.textContent = code.value.length;
  
  // Sync scroll
  lineNumbers.scrollTop = code.scrollTop;
}

// Sync scroll between editor and line numbers
document.getElementById('code').addEventListener('scroll', function() {
  document.getElementById('lineNumbers').scrollTop = this.scrollTop;
});

// Update line numbers on input
document.getElementById('code').addEventListener('input', updateLineNumbers);
document.getElementById('code').addEventListener('keydown', function(e) {
  // Handle Tab key for indentation
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 4;
    updateLineNumbers();
  }
  
  // Handle Ctrl+Enter for run
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    runCode();
  }
});

// Initialize line numbers
updateLineNumbers();

// Notification System
function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${isError ? '#ef4444' : '#10b981'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 1000;
    font-size: 14px;
    font-weight: 500;
    max-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Resizer Functionality
const dragbar = document.getElementById("dragbar");
const leftPanel = document.getElementById("codePanel");
const rightPanel = document.getElementById("outputPanel");
let isResizing = false;

dragbar.addEventListener("mousedown", initResize);
dragbar.addEventListener("touchstart", initResize);

function initResize(e) {
  e.preventDefault();
  isResizing = true;
  dragbar.classList.add('dragging');
  document.body.style.cursor = window.innerWidth <= 768 ? "row-resize" : "col-resize";
  document.body.style.userSelect = "none";
  
  if (e.type === 'mousedown') {
    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  } else {
    document.addEventListener("touchmove", doResize);
    document.addEventListener("touchend", stopResize);
  }
}

function doResize(e) {
  if (!isResizing) return;
  
  const isMobile = window.innerWidth <= 768;
  const containerRect = document.querySelector('.container').getBoundingClientRect();
  
  if (isMobile) {
    // Vertical resize for mobile
    const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const relativeY = y - containerRect.top;
    const containerHeight = containerRect.height;
    const percentage = Math.max(20, Math.min(80, (relativeY / containerHeight) * 100));
    
    leftPanel.style.flex = `0 0 ${percentage}%`;
    rightPanel.style.flex = `0 0 ${100 - percentage}%`;
  } else {
    // Horizontal resize for desktop
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const relativeX = x - containerRect.left;
    const containerWidth = containerRect.width;
    const percentage = Math.max(25, Math.min(75, (relativeX / containerWidth) * 100));
    
    leftPanel.style.flex = `0 0 ${percentage}%`;
    rightPanel.style.flex = `0 0 ${100 - percentage}%`;
  }
}

function stopResize() {
  isResizing = false;
  dragbar.classList.remove('dragging');
  document.body.style.cursor = "default";
  document.body.style.userSelect = "auto";
  
  document.removeEventListener("mousemove", doResize);
  document.removeEventListener("mouseup", stopResize);
  document.removeEventListener("touchmove", doResize);
  document.removeEventListener("touchend", stopResize);
}

// Dark/Light Mode Toggle
const toggle = document.getElementById('darkModeToggle');
const themeIcon = document.getElementById('themeIcon');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Get saved theme or default to system preference
const currentTheme = localStorage.getItem('theme') || 
                   (prefersDarkScheme.matches ? 'dark' : 'light');

// Apply initial theme
if (currentTheme === 'light') {
  document.body.classList.add('light-mode');
  themeIcon.src = "/Attachments/moon.png";
}

// Toggle functionality
toggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  if (isLight) {
    themeIcon.src = "/Attachments/moon.png";
  } else {
    themeIcon.src = "/Attachments/sun.png";
  }
});

// Watch for system theme changes
prefersDarkScheme.addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    const isLight = !e.matches;
    document.body.classList.toggle('light-mode', isLight);
    if (isLight) {
      themeIcon.src = "/Attachments/moon.png";
    } else {
      themeIcon.src = "/Attachments/sun.png";
    }
  }
});

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + S to save (prevent default)
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    showNotification('Auto-save is always enabled!');
  }
  
  // Escape to clear output
  if (e.key === 'Escape') {
    clearOutput();
  }
  
  // F11 to toggle fullscreen
  if (e.key === 'F11') {
    e.preventDefault();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  // Reset panel sizes on orientation change
  if (window.innerWidth <= 768) {
    leftPanel.style.flex = '';
    rightPanel.style.flex = '';
  }
  
  // Update line numbers on resize
  setTimeout(updateLineNumbers, 100);
});

// Auto-save functionality (using memory storage)
let autoSaveTimer;
document.getElementById('code').addEventListener('input', function() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    // Save to memory (session storage alternative)
    window.savedCode = this.value;
  }, 1000);
});

// Restore saved code on page load
window.addEventListener('load', function() {
  if (window.savedCode) {
    document.getElementById('code').value = window.savedCode;
    updateLineNumbers();
  }
});

// Prevent accidental page close
window.addEventListener('beforeunload', function(e) {
  const code = document.getElementById('code').value;
  if (code.trim() && code.trim() !== '// Write your JavaScript code here...') {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
});

// Performance optimization: Debounced line number updates
let lineUpdateTimer;
function debouncedLineUpdate() {
  clearTimeout(lineUpdateTimer);
  lineUpdateTimer = setTimeout(updateLineNumbers, 50);
}

// Replace direct updateLineNumbers calls with debounced version for better performance
document.getElementById('code').removeEventListener('input', updateLineNumbers);
document.getElementById('code').addEventListener('input', debouncedLineUpdate);

// Add smooth scrolling for better UX
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 100);
  });
});

// Initialize responsive behavior
function initResponsive() {
  const isMobile = window.innerWidth <= 768;
  const container = document.querySelector('.container');
  
  if (isMobile) {
    container.style.flexDirection = 'column';
  } else {
    container.style.flexDirection = 'row';
  }
}

// Call on load and resize
initResponsive();
window.addEventListener('resize', initResponsive);

console.log('🚀 TryCode JavaScript Editor loaded successfully!');
console.log('💡 Tips:');
console.log('   • Use Ctrl+Enter to run code');
console.log('   • Use Tab for indentation');
console.log('   • Use Escape to clear output');
console.log('   • Code is auto-saved as you type');