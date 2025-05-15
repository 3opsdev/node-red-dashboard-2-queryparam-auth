let plugin_name = "node-red-dashboard-2-queryparams-clientdata";
module.exports = function (RED) {
  RED.plugins.registerPlugin(plugin_name, {
    // Tells Node-RED this is a Node-RED Dashboard 2.0 plugin
    type: "node-red-dashboard-2",

    hooks: {
      /**
       * onAddConnectionCredentials - called when a D2.0 is about to send a message in Node-RED
       * @param {object} conn - SocketIO connection object
       * @param {object} msg - Node-RED msg object
       * @returns {object} - Returns Node-RED msg object
       */
      onAddConnectionCredentials: (conn, msg) => {
        if (!msg._client) {
          console.log(
            `${plugin_name}: msg._client is not found, not adding user info. This sometimes happens when the editor is refreshed with stale connections to the dashboard.`
          );
          return msg;
        }
        var queryParams = {};
		const headers = conn.request.headers;
		
		const referer = headers["referer"] || null
		if (referer) {
			queryParams = new URLSearchParams(new URL(referer).search);
		}
		
		const cookies = headers.cookie;
		if (cookies) {
			let pairs = cookies.split(";");
			let splittedPairs = pairs.map(cookie => cookie.split("="));
			const cookieObj = splittedPairs.reduce(function (obj, cookie) {
				obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(cookie[1].trim());
				return obj;
			}, {})
	
			msg._client["cookies"] = cookieObj;
		}
		
	    // Just for debugging ... 
		console.warn(`${JSON.stringify(headers)}\r\n\r\n`)
        msg._client["queryParams"] = Object.fromEntries(queryParams.entries());;
        return msg;
      },
    },
  });
};
