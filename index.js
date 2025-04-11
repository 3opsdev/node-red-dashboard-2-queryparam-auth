let plugin_name = "node-red-dashboard-2-queryparam-auth";
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
        var user = {};
		const headers = conn.request.headers;
        const queryParams = conn.request?.query;
        // Just for debugging ... 
        console.warn(`${JSON.stringify(conn.request)}`)
		console.warn(`${JSON.stringify(headers)}`)
		console.warn(`${JSON.stringify(msg)}`)
        const http_user = queryParams?.identifier || null
        if (!http_user) {
          console.warn(
            `${plugin_name}: Session is not authenticated by Query Param; no user detected. See query params: ${JSON.stringify(
              queryParams
            )}`
          );
        } else {
          console.log(
            `${plugin_name}: Dashboard interacted with by ${http_user}`
          );
        }
        user.host = headers["host"] || null;
        user.agent = headers["user-agent"] || null;
        user.userId =  http_user
        user.provider = "HTTP Query Param Auth";
        msg._client["user"] = user;
        return msg;
      },
    },
  });
};
