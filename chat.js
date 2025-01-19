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

// Sample items and concepts (can be expanded)
const items = [
    'supermarket', 'paper airplane', 'moon landing', 'pet turtle', 'photosynthesis', 'Eiffel Tower', 'blog', 'iPhone', 'concert tickets',
    'chess', 'World War II', 'Great Wall of China', 'scrambled eggs', 'quantum physics', 'used car', 'cake', 'climate change', 'sleep',
    'Titanic', 'gym', 'smartphone screen', 'solar eclipse', 'passport photo', 'cat', 'dinosaurs', 'free music', 'resume', 'Mars', 
    'Paris', 'productivity', 'holiday', 'art supplies', 'meditate', 'computer', 'Mount Everest', 'headache', 'tomatoes', 'blood donation',
    'memory', 'television', 'Bermuda Triangle', 'dishwasher', 'full moon', 'coffee', 'weight loss', 'housing'
];

// Function to generate a query
const generateQuery = () => {
    const randomStructure = questionStructures[Math.floor(Math.random() * questionStructures.length)];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    return randomStructure.replace(/{place}/g, randomItem)
        .replace(/{action}/g, randomItem)
        .replace(/{item}/g, randomItem)
        .replace(/{concept}/g, randomItem)
        .replace(/{event}/g, randomItem)
        .replace(/{location}/g, randomItem)
        .replace(/{verb}/g, randomItem)
        .replace(/{skill}/g, randomItem)
        .replace(/{purpose}/g, randomItem);
};

// Main Function to handle everything
(async () => {
    try {
        console.log('BOT Auto SendCHAT GAIANET By [Peking404XChupiiPrt666]\n');

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
