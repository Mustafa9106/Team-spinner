// List of 10 teams with their placeholder image URLs for the shirt design reveal.
const teams = [
    { id: 1, name: "MM Fighters", tagline: "Electric blue and fast yellow.", color: "Indigo", image: "/images/tsa.jpeg" },
    { id: 2, name: "GM Bravo", tagline: "Rising in crimson and gold.", color: "Red", image: "https://placehold.co/500x500/EF4444/FFFFFF?text=PHOENIX+JERSEY" },
    { id: 3, name: "TCC Thunders", tagline: "Strength in black and emerald.", color: "Green", image: "https://placehold.co/500x500/10B981/000000?text=IRON+DRAGONS+JERSEY" },
    { id: 4, name: "ST Squad", tagline: "A vibrant, striking purple.", color: "Purple", image: "https://placehold.co/500x500/A855F7/FFFFFF?text=RAPTORS+JERSEY" },
    { id: 5, name: "Zain Strikers", tagline: "Victory in fiery orange.", color: "Orange", image: "https://placehold.co/500x500/F97316/000000?text=GLADIATORS+JERSEY" },
    { id: 6, name: "Khatri KnightRiders", tagline: "Sleek and stealthy grey.", color: "Gray", image: "https://placehold.co/500x500/6B7280/FFFFFF?text=STEALTH+NINJAS+JERSEY" },
    { id: 7, name: "Manai Kings", tagline: "Classic maroon and bold.", color: "Maroon", image: "https://placehold.co/500x500/B91C1C/FDE047?text=TITANS+JERSEY" },
    { id: 8, name: "Samad Shaheens", tagline: "Striking neon lime green.", color: "Lime", image: "https://placehold.co/500x500/84CC16/000000?text=VIPERS+JERSEY" },
    { id: 9, name: "Saqib Stallions", tagline: "Speeding in bright cyan.", color: "Cyan", image: "https://placehold.co/500x500/06B6D4/FFFFFF?text=COMETS+JERSEY" },
    { id: 10, name: "The Mavericks", tagline: "Defiance in deep teal.", color: "Teal", image: "https://placehold.co/500x500/0D9488/FFFFFF?text=MAVERICKS+JERSEY" },
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
    let bgColor = 'bg-indigo-500';
    if (team.color === 'Red') bgColor = 'bg-red-500';
    else if (team.color === 'Green') bgColor = 'bg-green-500';
    else if (team.color === 'Purple') bgColor = 'bg-purple-500';
    else if (team.color === 'Orange') bgColor = 'bg-orange-500';
    else if (team.color === 'Gray') bgColor = 'bg-gray-500';
    else if (team.color === 'Maroon') bgColor = 'bg-rose-700';
    else if (team.color === 'Lime') bgColor = 'bg-lime-500';
    else if (team.color === 'Cyan') bgColor = 'bg-cyan-500';
    else if (team.color === 'Teal') bgColor = 'bg-teal-500';

    return `
        <div 
            class="team-card ${bgColor} text-white p-6 rounded-xl shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-b-4 border-r-4 border-opacity-70 border-gray-900" 
            onclick="openModal(${team.id})"
        >
            <div class="text-4xl font-extrabold mb-1">#${team.id}</div>
            <h3 class="text-xl font-bold text-center mt-2">${team.name}</h3>
            <p class="text-sm text-center italic text-opacity-80">${team.tagline}</p>
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
