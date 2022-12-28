const mongoose = require("mongoose");

module.exports = async (Scheme) => {

            
    let connection = await mongoose.connect(
        "mongodb://localhost:27017/exchange?socketTimeoutMS=90000",
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    let md = connection.model(Scheme.name, Scheme.scheme);
    
    return md;

    
}