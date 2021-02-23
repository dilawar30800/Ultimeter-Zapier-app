// Fetches a list of records from the endpoint
const perform = async (z, bundle) => {
    const raw = bundle.authData.url.toString();
    const request = {
        url: raw + '/wp-json/ultimeter/v1/ultimeters/',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-URL': bundle.authData.url,
            'X-USER': bundle.authData.user,
            'X-PASSWORD': bundle.authData.password,
        },
        params: {},
    };

    return z.request(request)
        .then((response) => {
            response.throwForStatus();
            const results = response.json;

            // You can do any parsing you need for results here before returning them

            return results;
        });
};

module.exports = {
    key: 'meters',
    noun: 'meter',
    display: {
        label: 'List of Meters',
        description:
            'This is a hidden trigger, and is used in a Dynamic Dropdown of another trigger.',
        hidden: false,
    },

    operation: {
        // Since this is a "hidden" trigger, there aren't any inputFields needed
        perform
    },
};