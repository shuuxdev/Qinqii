import axios from 'axios';

let servers = {
    iceServers: []
}
let fetchTurnServers = async () => {
    const response = await fetch("https://qinqii.metered.live/api/v1/turn/credentials?apiKey=4e8a7e31bc4d677c43f8d794ff581ad2dc3e");
    const fetchIceServers = await response.json();
    servers.iceServers = [...fetchIceServers];
    servers.iceServers.pop();
    console.log(servers.iceServers);
};
// fetchTurnServers();
const accountSid = 'ACf5008876daccafb9a7294a2c6e1035d0'
const authToken = '815b71ebf209922e3aaa817eea94b67a'
const baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Tokens.json`
let fetchToken = async () => {
    const token = await axios
        .post(
            baseUrl,
            {},
            {
                auth: {
                    username: accountSid,
                    password: authToken,
                },
            }
        )
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
    servers.iceServers = [...token.ice_servers];
    console.log(servers.iceServers)
}
fetchToken();

export default servers
