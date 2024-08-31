const messages = [
    "I will meet Johnson in the Curtin University, tomorrow 10pm.",
    "Lunch with Sarah at Cafe Nero, next Tuesday at 1pm.",
    "Team meeting in Conference Room A, every Monday at 9am.",
    "Dentist appointment at Smith Clinic, March 15th at 2:30pm."
  ];
  
  let currentMessageIndex = 0;
  
  function highlightText(text) {
    const regex = /(\b\w+(?:\s+\w+)?)(?=\s+(?:in|at)\s)|(?<=(?:in|at)\s)([^,]+)|(?<=,\s)([^.]+)/g;
    let lastIndex = 0;
    let result = '';
    let match;
  
    while ((match = regex.exec(text)) !== null) {
      result += text.slice(lastIndex, match.index);
      if (match[1]) {
        result += `<span class="highlight-person">${match[1]}</span>`;
      } else if (match[2]) {
        result += `<span class="highlight-location">${match[2]}</span>`;
      } else if (match[3]) {
        result += `<span class="highlight-time">${match[3]}</span>`;
      }
      lastIndex = regex.lastIndex;
    }
    result += text.slice(lastIndex);
    return result;
  }
  
  function extractInfo(text) {
    const personMatch = text.match(/(\b\w+(?:\s+\w+)?)(?=\s+(?:in|at)\s)/);
    const locationMatch = text.match(/(?<=(?:in|at)\s)([^,]+)/);
    const timeMatch = text.match(/(?<=,\s)([^.]+)/);
  
    return {
      person: personMatch ? personMatch[1] : '',
      location: locationMatch ? locationMatch[1] : '',
      time: timeMatch ? timeMatch[1] : ''
    };
  }
  
  function fillForm(info) {
    document.getElementById('title').value = `Meet ${info.person}`;
    document.getElementById('location').value = info.location;
    document.getElementById('when').value = info.time;
    document.getElementById('details').value = `Meeting with ${info.person} at ${info.location}`;
    
    // Add highlight class to form
    document.querySelector('.calendar-form').classList.add('highlight');
    
    // Trigger firework animation
    createFireworks();
  }
  
  function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('location').value = '';
    document.getElementById('when').value = '';
    document.getElementById('details').value = '';
    
    // Remove highlight class from form
    document.querySelector('.calendar-form').classList.remove('highlight');
  }
  
  function createFireworks() {
    const formRect = document.querySelector('.calendar-form').getBoundingClientRect();
    const count = 20;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
      const firework = document.createElement('div');
      firework.className = 'firework';
      firework.style.left = `${formRect.left + Math.random() * formRect.width}px`;
      firework.style.top = `${formRect.top + Math.random() * formRect.height}px`;
      firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      firework.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
      firework.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
      
      fragment.appendChild(firework);
    }
    
    document.body.appendChild(fragment);
    
    setTimeout(() => {
      const fireworks = document.querySelectorAll('.firework');
      fireworks.forEach(firework => firework.remove());
    }, 500);
  }
  
  function startTypewriter() {
    new TypeIt("#typewriter", {
      strings: messages[currentMessageIndex],
      speed: 50,
      cursor: true,
      afterComplete: async (instance) => {
        const text = instance.getElement().innerHTML;
        const highlightedText = highlightText(text);
        instance.getElement().innerHTML = highlightedText;
        
        setTimeout(() => {
          const info = extractInfo(text);
          fillForm(info);
          
          // Move to the next message
          currentMessageIndex = (currentMessageIndex + 1) % messages.length;
          
          // Clear the typewriter and form, then start the next message after a delay
          setTimeout(() => {
            instance.getElement().innerHTML = '';
            clearForm();
            startTypewriter();
          }, 3000);
        }, 1000);
      }
    }).go();
  }
  
  startTypewriter();