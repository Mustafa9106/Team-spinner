// List of 10 teams with their placeholder image URLs for the shirt design reveal.
const teams = [
    { id: 1, name: "Talal Titans", color: "Pink", image: "/images/talal.jpeg" },
    { id: 2, name: "GM Bravo",  color: "Cyan", image: "/images/gm.jpeg" },
    { id: 3, name: "Zain Strikers", color: "Green", image: "/images/zain.jpeg" },
    { id: 4, name: "Khatri KnightRiders",  color: "Purple", image: "/images/khatri.jpeg" },
    { id: 5, name: "MM Fighters", color: "Orange", image: "/images/mm.jpeg" },
    { id: 6, name: "ST Squads",  color: "Gray", image: "/images/st.jpeg" },
    { id: 7, name: "Saqib Stallions",  color: "Maroon", image: "/images/saqib.jpeg" },
    { id: 8, name: "Samad Shaheens",  color: "amber", image: "/images/samad.jpeg" },
    { id: 9, name: "Executive XI",  color: "Yellow", image: "/images/ex.jpeg" },
    { id: 10, name: "TCC Thunders",  color: "stone", image: "/images/tcc.jpeg" },
];

// Get DOM elements
const teamGrid = document.getElementById('team-grid');
const modal = document.getElementById('design-modal');
const modalTeamName = document.getElementById('modal-team-name');
const modalShirtImage = document.getElementById('modal-shirt-image');
const modalShirtDescription = document.getElementById('modal-shirt-description');

/**
 * Generates the HTML card for a single team.
 * @param {Object} team - The team data object.
 * @returns {string} The HTML string for the team card.
 */
function createTeamCard(team) {
    // Determine a highlight color class based on the team's primary color
    let bgColor = 'bg-pink-500';
    if (team.color === 'Yellow') bgColor = 'bg-yellow-500';
    else if (team.color === 'Green') bgColor = 'bg-green-700';
    else if (team.color === 'Purple') bgColor = 'bg-purple-800';
    else if (team.color === 'Orange') bgColor = 'bg-orange-600';
    else if (team.color === 'Gray') bgColor = 'bg-gray-500';
    else if (team.color === 'Maroon') bgColor = 'bg-rose-700';
    else if (team.color === 'amber') bgColor = 'bg-amber-500';
    else if (team.color === 'Cyan') bgColor = 'bg-cyan-500';
    else if (team.color === 'stone') bgColor = 'bg-stone-950';

    return `
        <div 
            class="team-card ${bgColor} text-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-b-4 border-r-4 border-opacity-70 border-gray-900" 
            onclick="openModal(${team.id})"
        >
            <div class="text-4xl font-extrabold mb-1">#${team.id}</div>
            <h3 class="text-xl font-bold text-center mt-2">${team.name}</h3>
        </div>
    `;
}

/**
 * Renders all team cards into the grid.
 */
function renderTeamCards() {
    teamGrid.innerHTML = teams.map(createTeamCard).join('');
}

/**
 * Opens the modal with the selected team's shirt design.
 * This function is global so it can be called directly from the HTML onclick attribute.
 * @param {number} teamId - The ID of the team to display.
 */
function openModal(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    // Set modal content
    modalTeamName.textContent = team.name;
    modalShirtImage.src = team.image;
    modalShirtImage.onload = () => {
        // Fade in the image once it's loaded
        modalShirtImage.classList.remove('opacity-0');
        modalShirtImage.classList.add('opacity-100');
    };
    modalShirtImage.onerror = () => {
         // Handle image loading error (e.g., if placeholder service fails)
        modalShirtImage.src = 'https://placehold.co/500x500/CCCCCC/000000?text=Design+Not+Available';
        modalShirtImage.classList.remove('opacity-0');
        modalShirtImage.classList.add('opacity-100');
    };
    modalShirtImage.classList.remove('opacity-100'); // Reset opacity for transition
    modalShirtImage.classList.add('opacity-0'); // Start hidden

    // modalShirtDescription.textContent = `${team.name}'s official design features their signature ${team.color} color palette.`;

    // Display the modal using Tailwind classes
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Add a class to enable the modal transition effects
    setTimeout(() => {
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 50);
}

/**
 * Closes the shirt reveal modal.
 * This function is global so it can be called directly from the HTML onclick attribute.
 */
function closeModal() {
    // Start the close transition
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');

    // Wait for transition to finish before hiding
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // Clean up image source and description on close
        modalShirtImage.src = "";
        modalShirtDescription.textContent = "";
        modalTeamName.textContent = "";
    }, 300);
}

// Initialize the app when the window loads
window.onload = function() {
    renderTeamCards();

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
};
