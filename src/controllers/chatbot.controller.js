import express from "express";
const request = require('request');
require('dotenv').config();
// Your verify token. Should be a random string.
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getWebhook = (req, res, next) => {
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}


let postWebhook = (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

// handle message
function handleMessage(sender_psid, received_message) {

    let response;

    // Check if the message contains text
    if (received_message.text) {

        if (received_message.text === 'Gửi ảnh đồ gỗ') {
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                                "title": "Bộ bàn ghế gỗ cẩm",
                                "subtitle": "22.000.000 VNĐ",
                                "image_url": 'https://noithatdogohcm.com/upload/images/can-ban-do-go-cu.JPG',
                                "buttons": [{
                                        "type": "postback",
                                        "title": "Xem chi tiết...",
                                        "payload": "product1",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt hàng",
                                        "payload": "product:1",
                                    }
                                ],
                            },
                            {
                                "title": "Bộ bàn ghế gỗ cẩm",
                                "subtitle": "22.000.000 VNĐ",
                                "image_url": 'https://noithatdogohcm.com/upload/images/bo-ban-ghe-go-cam-lai-tay-16(1).JPG',
                                "buttons": [{
                                        "type": "postback",
                                        "title": "Xem chi tiết...",
                                        "payload": "product2",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt hàng",
                                        "payload": "no",
                                    }
                                ],
                            },
                            {
                                "title": "Bộ bàn ghế gỗ cẩm",
                                "subtitle": "22.000.000 VNĐ",
                                "image_url": 'https://noithatdogohcm.com/upload/images/bo-ban-ghe-go-cam-lai-tay-16%20(3).JPG',
                                "buttons": [{
                                        "type": "postback",
                                        "title": "Xem chi tiết...",
                                        "payload": "yes",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt hàng",
                                        "payload": "no",
                                    }
                                ],
                            },
                            {
                                "title": "Bộ bàn ghế gỗ cẩm",
                                "subtitle": "22.000.000 VNĐ",
                                "image_url": 'https://noithatdogohcm.com/upload/images/can-ban-do-go-cu.JPG',
                                "buttons": [{
                                        "type": "postback",
                                        "title": "Xem chi tiết...",
                                        "payload": "yes",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt hàng",
                                        "payload": "no",
                                    }
                                ],
                            },
                            {
                                "title": "Bộ bàn ghế gỗ cẩm",
                                "subtitle": "22.000.000 VNĐ",
                                "image_url": 'https://noithatdogohcm.com/upload/images/can-ban-do-go-cu.JPG',
                                "buttons": [{
                                        "type": "postback",
                                        "title": "Xem chi tiết...",
                                        "payload": "yes",
                                    },
                                    {
                                        "type": "postback",
                                        "title": "Đặt hàng",
                                        "payload": "no",
                                    }
                                ],
                            },
                        ]
                    }
                }
            }
        } else {
            // Create the payload for a basic text message
            response = {
                "text": `You sent the message: "${received_message.text}". Now send me an image!`
            }
        }

    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}
// Handle Postback
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;


    switch (payload) {
        case "product1":
            response = {
                "text": "Bộ bàn ghế gỗ cẩm 1"
            }
            break;
        case "product2":
            response = {
                "text": "Bộ bàn ghế gỗ cẩm 2"
            }
            break;

        default:
            break;
    }

    // // Set the response based on the postback payload
    // if (payload === 'product1') {
    //     response = { "text": "Thanks!" }
    // } else if (payload === 'no') {
    //     response = { "text": "Oops, try sending another image." }
    // }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}


function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}




module.exports = {
    getWebhook: getWebhook,
    postWebhook: postWebhook
}