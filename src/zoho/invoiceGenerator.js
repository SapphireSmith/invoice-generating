
export const invoiceGenerator = () => {
    const options = {
        method: 'POST',
        headers: {
            'X-com-zoho-invoice-organizationid': '10234695',
            Authorization: 'Zoho-oauthtoken 1000.41d9xxxxxxxxxxxxxxxxxxxxxxxxc2d1.8fccxxxxxxxxxxxxxxxxxxxxxxxx125f',
            'content-type': 'application/json'
        },
        body: '{"field1":"value1","field2":"value2"}'
    };

    fetch('https://www.zohoapis.com/invoice/v3/organizations')
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}