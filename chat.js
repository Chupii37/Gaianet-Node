const axios = require("axios");
const fs = require('fs');
const readline = require('readline');

// Utility function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Create a readline interface to prompt the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt the user for the Node ID
const askForNodeId = () => {
    return new Promise(resolve => {
        rl.question('Please enter your Node ID: ', nodeId => {
            resolve(nodeId);
            rl.close(); // Close the readline interface after receiving input
        });
    });
};

// Sample question structures and items
const questionStructures = [
    'where is the nearest {place}',
    'how to {action} {item}',
    'when was the {event}',
    'where can I buy a {item}',
    'how does {concept} work',
    'where is {location} located',
    'how to {action}',
    'when was the {event} first {verb}',
    'where can I find {item}',
    'how to {action} {item} for {purpose}',
    'when did {event} happen',
    'where can I get {item}',
    'how to improve my {skill}',
    'when is the next {event}',
    'where to visit in {location}'
];

// More context-specific lists
const places = [
    'supermarket', 'library', 'park', 'museum', 'Eiffel Tower', 'Paris', 'Tokyo', 'New York', 'beach'
];
const actions = [
    'build', 'repair', 'find', 'make', 'create', 'learn', 'improve', 'cook', 'design'
];
const items = [
    'cake', 'iPhone', 'chess', 'moon landing', 'pet turtle', 'Eiffel Tower', 'smartphone', 'blog', 'used car'
];
const events = [
    'World War II', 'moon landing', 'Titanic sinking', 'solar eclipse', 'solar storm'
];
const verbs = [
    'see', 'find', 'visit', 'celebrate', 'experience'
];
const skills = [
    'writing', 'programming', 'painting', 'cooking', 'public speaking', 'playing chess'
];
const concepts = [
    'photosynthesis', 'quantum physics', 'climate change', 'gravity', 'free will'
];
const locations = [
    'Paris', 'New York', 'Mars', 'the moon', 'Bermuda Triangle', 'Mount Everest'
];
const purposes = [
    'study', 'work', 'hobby', 'exercise', 'health'
];

// Function to generate a query
const generateQuery = () => {
    const randomStructure = questionStructures[Math.floor(Math.random() * questionStructures.length)];

    // Replace each placeholder with an appropriate item based on its category
    const query = randomStructure
        .replace(/{place}/g, places[Math.floor(Math.random() * places.length)])
        .replace(/{action}/g, actions[Math.floor(Math.random() * actions.length)])
        .replace(/{item}/g, items[Math.floor(Math.random() * items.length)])
        .replace(/{concept}/g, concepts[Math.floor(Math.random() * concepts.length)])
        .replace(/{event}/g, events[Math.floor(Math.random() * events.length)])
        .replace(/{location}/g, locations[Math.floor(Math.random() * locations.length)])
        .replace(/{verb}/g, verbs[Math.floor(Math.random() * verbs.length)])
        .replace(/{skill}/g, skills[Math.floor(Math.random() * skills.length)])
        .replace(/{purpose}/g, purposes[Math.floor(Math.random() * purposes.length)]);

    return query;
};

// Main Function to handle everything
(async () => {
    try {
        console.log('BOT Auto Send CHAT GAIANET By Chupii\n');

        // Get Node ID from user
        const nodeId = await askForNodeId();
        console.log(`Using Node ID: ${nodeId}`);

        // Initialize a set to keep track of generated queries to avoid duplicates
        const generatedQueries = new Set();

        // Start an infinite loop for generating queries
        while (true) {
            // Generate a new query
            const query = generateQuery();
            
            // Check if the query has already been generated (to avoid duplicates)
            if (generatedQueries.has(query)) {
                continue; // Skip this iteration and generate a new query
            }

            // Add the new query to the set
            generatedQueries.add(query);

            // Log the generated query
            console.log(`Generated Query: "${query}"`);

            // Save the query to chatkey.txt
            fs.appendFileSync('chatkey.txt', `${query}\n`, 'utf-8');
            console.log('Query saved to chatkey.txt');

            // Process the query by sending it to the Gaianet API
            try {
                const response = await axios.post(
                    `https://${nodeId}.us.gaianet.network/v1/chat/completions`,
                    {
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: query }
                        ]
                    },
                    {
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`Response: [${response.data.choices[0].message.content}]\n`);
                console.log("DONE MEK!\n\n");
            } catch (error) {
                console.error(`Error during API request: ${error.response ? error.response.data : error.message}`);
            }

            // Wait 30 seconds before the next request
            await delay(30000); // 30-second delay
        }
    } catch (error) {
        console.error("Error: ", error);
    }
})();
