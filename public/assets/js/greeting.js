window.onload = function() {
    const storedName = localStorage.getItem('userName');
    
    // Only show greeting if name exists
    if (storedName) {
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            updateGreeting(storedName);
        }
    }
    // Don't show the name prompt - password gate handles this
};

function updateGreeting(name) {
    const { text, icon } = getGreeting();
    const el = document.getElementById('greeting');
    if (el) {
        el.innerHTML = `${icon} ${text}, ${name}!`;
        el.style.opacity = 1;
    }
}

function getGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const options = [];

    if (hour >= 5 && hour < 12) {
        options.push(
            { text: 'Good morning, sunshine', icon: '<i class="fa-regular fa-sun"></i>' },
            { text: 'Here's to a bright morning', icon: '<i class="fa-regular fa-cloud-sun"></i>' },
            { text: 'Morning vibes only', icon: '<i class="fa-regular fa-mug-hot"></i>' },
            { text: 'Your day starts here', icon: '<i class="fa-regular fa-star"></i>' }
        );
    } else if (hour < 17) {
        options.push(
            { text: 'Good afternoon', icon: '<i class="fa-regular fa-leaf"></i>' },
            { text: 'Hope your day is going well', icon: '<i class="fa-regular fa-coffee"></i>' },
            { text: 'Keep up the pace', icon: '<i class="fa-regular fa-book"></i>' },
            { text: 'Stay on track today', icon: '<i class="fa-regular fa-sun"></i>' }
        );
    } else if (hour < 21) {
        options.push(
            { text: 'Good evening', icon: '<i class="fa-regular fa-cloud-moon"></i>' },
            { text: 'Time to unwind', icon: '<i class="fa-regular fa-fire"></i>' },
            { text: 'Evening's here—relax', icon: '<i class="fa-regular fa-star"></i>' },
            { text: 'Breathe and recharge', icon: '<i class="fa-regular fa-moon"></i>' }
        );
    } else {
        options.push(
            { text: 'Good night', icon: '<i class="fa-regular fa-bed"></i>' },
            { text: 'Rest well', icon: '<i class="fa-regular fa-blanket"></i>' },
            { text: 'Sweet dreams', icon: '<i class="fa-regular fa-star-and-crescent"></i>' },
            { text: 'See you tomorrow', icon: '<i class="fa-regular fa-moon"></i>' }
        );
    }

    if (day === 4) {
        options.push(
            { text: 'Thursday mode: engaged', icon: '<i class="fa-regular fa-party-popper"></i>' },
            { text: 'Almost Friday', icon: '<i class="fa-regular fa-music"></i>' },
            { text: 'Keep going', icon: '<i class="fa-regular fa-thumbs-up"></i>' }
        );
    }

    if (day === 0 || day === 6) {
        options.push(
            { text: 'Happy weekend', icon: '<i class="fa-regular fa-umbrella-beach"></i>' },
            { text: 'Enjoy some downtime', icon: '<i class="fa-regular fa-cocktail"></i>' }
        );
    } else {
        options.push(
            { text: 'You've got this', icon: '<i class="fa-regular fa-hand-holding-heart"></i>' },
            { text: 'One step at a time', icon: '<i class="fa-regular fa-walking"></i>' },
            { text: 'Summer is coming', icon: '<i class="fa-regular fa-umbrella-beach"></i>' }
        );
    }

    return options[Math.floor(Math.random() * options.length)];
}
