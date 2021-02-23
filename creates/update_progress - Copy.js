// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.

const getUltimeter=async function(bundle,z) {

    const raw = bundle.authData.url.toString();
    const promise = z.request({
    url: raw + '/wp-json/ultimeter/v1/ultimeters/{{bundle.inputData.id}}',
    method: 'GET',
    params: {
    },
    headers: {
        'Content-Type': 'application/json',
    },
    
});

return await promise.then((response) => JSON.parse(response.content));

}
module.exports = {
    key: 'AdjustProgress',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'progress',
    display: {
        label: 'Adjust Progress',
        description: 'Adjust the progress of the chosen Ultimeter',
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
                key: 'operation',
                type: 'string',
                label: 'operation',
                choices: ['Increment', 'Decrement'],
                required: true,
                list: false,
                altersDynamicFields: false,
              },
        ],
        // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
        // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
        // returned records, and have obviously dummy values that we can show to any user.
        sample: {
            id: 1,
            title: 'My Awesome Ultimeter',
            operation: 'Increment'
        },
        // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
        // field definitions. The result will be used to augment the sample.
        // outputFields: () => { return []; }
        // Alternatively, a static field definition should be provided, to specify labels for the fields
        outputFields: [
            { key: 'id', label: 'Ultimeter ID', type: 'integer' },
            { key: 'title', label: 'Ultimeter Title', type: 'string' },
            { key: 'author', label: 'Author', type: 'string' },
            { key: '_ultimeter_raised_custom', label: 'New Progress (custom goal)' },
            { key: '_ultimeter_raised_percentage', label: 'New Progress (percentage goal)' },
            { key: '_ultimeter_raised_amount', label: 'New Progress (currency goal)' },
        ],
        perform: async(z, bundle) => {
            var ultimeter= awaitgetUltimeter(z,bundle);
            const raw = bundle.authData.url.toString();
            const promise = z.request({
                url: raw + '/wp-json/ultimeter/v1/ultimeters/{{bundle.inputData.id}}',
                method: 'PUT',
                params: {
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    _ultimeter_raised_amount: bundle.inputData.progress,
                    _ultimeter_raised_custom: bundle.inputData.progress,
                    _ultimeter_raised_percentage: bundle.inputData.progress
                },
            });

            return promise.then((response) => JSON.parse(response.content));
        },
    },
};