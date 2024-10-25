console.log("background.js loaded");


// sender: Provides details about the sender (such as which tab or component of the extension sent the message). It is helpful when dealing with messages from multiple tabs or scripts.
// sendResponse: Allows you to send a response back to the component that sent the message. It can be used synchronously (within the listener function) or asynchronously (by returning true from the listener and sending the response later).
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.action === "scrapedData") {

        const prodData = request.data;

        console.log("Scraped data received in background.js");
        // send this to the server
        fetch('http://localhost:3000/api/addProductData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prodData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                sendResponse({ response: "Data received by server" });
            })
            .catch((error) => {
                console.error('Error:', error);
                sendResponse({ response: "Error in sending data to server" });
            });
    }

    return true;
});


