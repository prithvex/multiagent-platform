const PLANS = [
    {
        id: 'free',
        name: 'Free',
        amount: 0,
        credits: 50,
        validity: 30, // days
    },
    {
        id: 'basic',
        name: 'Basic',
        amount: 999,
        credits: 100,
        validity: 30, // days
    },
    {
        id: 'standard',
        name: 'Standard',
        amount: 1999,
        credits: 250,
        validity: 30,
    },
    {
        id: 'pro',
        name: 'Pro',
        amount: 4999,
        credits: 700,
        validity: 60,
    },
    {
        id: 'premium',
        name: 'Premium',
        amount: 9999,
        credits: 1500,
        validity: 90,
    },
];

module.exports = PLANS;