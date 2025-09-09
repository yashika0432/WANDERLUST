const ExpressError=require("./utils/ExpressError");

const err = new ExpressError(404, "File not found");

console.log(err.status);   // should log: 404
console.log(err.message);