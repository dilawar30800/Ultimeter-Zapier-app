// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
    key: 'updateColor',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'color',
    display: {
        label: 'Update Color',
        description: 'Update the color of the chosen Ultimeter',
    },

    // `operation` is where the business logic goes.
    operation: {
        inputFields: [
            {
                key: 'id',
                type: 'integer',
                required: true,
                label: 'Pick the Ultimeter to update',
                dynamic: 'meters.id.title'
            },
            {
                key: 'color',
                required: true,
                type: 'string',
                label: 'Enter a new color for this Ultimeter. This should be a correctly formatted hex code, WITHOUT a preceding hash symbol (#).',
            },
        ],
        // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
        // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
        // returned records, and have obviously dummy values that we can show to any user.
        sample: {
            id: 1,
            title: 'My Awesome Ultimeter',
            author: 'Bouncingsprout Studio'
        },
        // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
        // field definitions. The result will be used to augment the sample.
        // outputFields: () => { return []; }
        // Alternatively, a static field definition should be provided, to specify labels for the fields
        outputFields: [
            { key: 'id', label: 'Ultimeter ID', type: 'integer' },
            { key: 'title', label: 'Ultimeter Title', type: 'string' },
            { key: 'author', label: 'Author', type: 'string' },
            { key: '_ultimeter_meter_color', label: 'New Color' }
        ],
        perform: (z, bundle) => {
            const raw = bundle.authData.url.toString();
            const promise = z.request({
                url: raw + '/wp-json/ultimeter/v1/ultimeters/{{bundle.inputData.id}}',
                method: 'PUT',
                params: {
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    _ultimeter_meter_color: bundle.inputData.color,
                },
            });

            return promise.then((response) => JSON.parse(response.content));
        },
    },
};