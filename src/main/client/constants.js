const limits = {
    messageFetch: 20,
    bufferChatScroll: 50,
    attachmentHeight: 350
}, logs = {
    // Log message parser outputs and elements
    messages: true,

    // Log other generated elements
    // elements: true,

    // Log loaded channels
    channels: true,

    // Log other internal values
    // values: true,

    // Log setup times
    timings: true
}, flags = {
    // noServerList: true,
    // disableLoaderCurtain: true
}, package = (() => {
    let {name, productName, version} = require("../package.json");
    return {
        name,
        productName,
        version
    }
})(), styleDimensions = {
    messagePadding: 120,
    maxMessageWidth() {
        return chatContent.clientWidth - this.messagePadding;
    }
}