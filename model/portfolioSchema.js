const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    buyingPower: {
        type: Number,
        default: 0
    },
    stocks: [{
        stockId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    transactions: [{
        stockId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock',
            required: true
        },
        transactionType: {
            type: String,
            enum: ['buy', 'sell'],
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;