import express from "express";
import path from "path";
let a = { "object": "page", "entry": [{ "messaging": [{ "message": "TEST_MESSAGE" }] }] };
let getHomePage = (req, res) => {
    res.json(a)
}




module.exports = {
    getHomePage: getHomePage
}