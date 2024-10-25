console.log("contentScript.js loaded");

function scrapeData() {
    console.log("Scraping data");

    // Getting the product name and title of the product.

    const productName = document.querySelector(".pdp-name").innerText;
    const productTitle = document.querySelector(".pdp-title").innerText;


    // Case when no discount is available.
    // We keep the same value in both mrp and price.
    // This is done to keep the data consistent.

    // Getting the MRP of the product.

    let productMrp = (document.querySelector(".pdp-mrp").innerText).substring(5);
    if (productMrp.length === 0) {
        productMrp = (document.querySelector(".pdp-price").innerText).substring(5);
    }


    // Getting the price of the product.

    let productPrice = (document.querySelector(".pdp-price").innerText).substring(1);
    if (isNaN(productPrice)) {
        productPrice = (document.querySelector(".pdp-price").innerText).substring(5);
    }


    // Getting the breadcrumbs of the product.

    const breadcrumbs = document.querySelector(".breadcrumbs-container").innerText;
    let breadCrumbArray = [];
    breadcrumbs.split("/").forEach(element => {
        breadCrumbArray.push(element.trim());
    });


    // Getting the image url of the product.

    const style = document.querySelector(".image-grid-image").getAttribute("style");
    const imageUrl = style.split('"')[1];


    // Getting the product id of the product.

    const url = window.location.href;
    const urlArray = url.split("/");
    const pid = urlArray[urlArray.length - 2];


    const productData = {
        pid: pid,
        productName: productName,
        productPrice: productPrice,
        productMrp: productMrp,
        productTitle: productTitle,
        breadcrumbs: breadCrumbArray,
        imageUrl: imageUrl
    }

    console.log(productData);

    chrome.runtime.sendMessage({ action: "scrapedData", data: productData }, function (response) {
        console.log(response);
    });

}

scrapeData();

console.log("function called");